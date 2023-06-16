import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

			if (!response.ok || !response)
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
		const token = await this.signToken(user.userId, user.email, response);

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

	async signToken(userId: number, email: string, response: any): Promise<string> {
		const payload = {
			exp: response.expires_in,
			iat: response.created_at,
			sub: userId,
			email
		};
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.sign(payload, {
			secret: secret
		});
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
}
