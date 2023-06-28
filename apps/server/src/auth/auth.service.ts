import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	async getUserInfo(accessToken: string): Promise<FortyTwoUser> {
		try {
			const response = await fetch('https://api.intra.42.fr/v2/me', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + accessToken,
				},
			});

			if (!response || !response.ok)
				throw new Error('Failed to fetch user info');

			const data = await response.json();
			const newUser: FortyTwoUser = {
				userId: data.id,
				username: data.login,
				email: data.email,
				firstName: data.first_name,
				lastName: data.last_name,
				picture: data.image.link,
			};

			return newUser;
		} catch (error) {
			console.error('Error: ', error);
			throw error;
		}
	}

	async exchangeCodeForToken(code: string): Promise<any> {
		try {
			const params = {
				grant_type: 'authorization_code',
				code: code,
				client_id: process.env.FT_CLIENT_ID,
				client_secret: process.env.FT_CLIENT_SECRET,
				redirect_uri: process.env.FT_CALLBACK_URL,
			};
			
			const data = new URLSearchParams(params);
			const response = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				body: data,
			});
			
			if (!response || !response.ok)
				throw new Error('Failed to exchange code for token');

			const responseData = await response.json();
		    return responseData;
		} catch (error) {
			console.error('Error: ', error);
			throw error;
		}
	}
	
	async handleCallback(response: any): Promise<any> {
		const user: FortyTwoUser = await this.getUserInfo(response.access_token);
		const token = await this.signToken(user.userId, user.username, user.email, response);

		await this.prisma.user.upsert({
			where: { email: user.email },
			create: {
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.username,
				profilePicPath: user.picture,
				jwt: token,
			},
			update: {
				jwt: token,
			},
		});
		return token;
	}

	async signToken(userId: number, username: string, email: string, response: any): Promise<string> {
		const payload = {
			userId,
			email,
			username
		};
		const expiresIn = response.expires_in;
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.sign(payload, {
			secret: secret,
			expiresIn: '15d',
		});
		console.log('expiresIn', expiresIn,);
		return token;
	}

	async validateUser(details: FortyTwoUser) {
		console.log('validateUser', details);
		const user = await this.prisma.user.findUnique({
			where: {
				email: details.email,
			},
		});
		if (user)
			return user;
		
		const newUser = this.createUser(details);
		return newUser;
	}

	async createUser(user: FortyTwoUser): Promise<User> {
		try {
			const newUser = this.prisma.user.create({
				data: {
					id: user.userId,
					email: user.email,
					name: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					profilePicPath: user.picture,
				},
			});
			return newUser;
		} catch (e) {
			throw (new InternalServerErrorException());
		}
	}

	async findUser(id: number) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
		});
	}

	async generateTwoFactorAuthenticationSecret(user) {
		const secret = authenticator.generateSecret();
		console.log('user', user);
		console.log('user.email', user.email);
		console.log('secret', secret);
	
		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence', secret);
		console.log('otpauthUrl', otpauthUrl);
	
		await this.setTwoFactorAuthenticationSecret(secret, user.id, user.email);
		console.log('secret', secret, '\notpauthUrl', otpauthUrl);
	
		return {secret, otpauthUrl};
	  }

	  async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	  }

	  async setTwoFactorAuthenticationSecret(secret: string, userId: number, email: string) {
		try {
			return await this.prisma.user.update({
				where: {
					id: userId,
					email: email,
				},
				data: {
					twoFASecret: secret,
				},
			});
	  } catch (e) {
			console.error('Error when setting 2FA secret:', e);
			throw (new InternalServerErrorException('Failed to set two factor authentication secret'));
		}
	}			

	  async turnOnTwoFactorAuthentication(userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFAEnabled: true
			},
		});
	  }

	  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: any) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFASecret,
		});
	  }

	  async loginWith2fa(user: Partial<User>) {
		const payload = {
			userId: user.id,
			username: user.name,
			email: user.email,
			twoFAEnabled: !!user.twoFAEnabled,
			isTwoFactorAuthenticated: true,
		};
	
		return {
		  email: payload.email,
		  access_token: this.jwt.sign(payload),
		};
	  }
}