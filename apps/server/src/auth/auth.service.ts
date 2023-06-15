import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

type ftUser = {
	user_id: number;
	email: string;
	first_name: string;
	last_name: string;
	login: string;
	image_url: string;
}

@Injectable()
export class AuthService {

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	async getUserInfo(accessToken: string): Promise<ftUser> {
		const response: ftUser | void = await fetch('https://api.intra.42.fr/v2/me', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + accessToken,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const newUser: ftUser = {
					user_id: data.id,
					email: data.email,
					first_name: data.first_name,
					last_name: data.last_name,
					login: data.login,
					image_url: data.image.link,
				}
				return newUser;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		if (response)
			return response;
	}

	async exchangeCodeForToken(code: string): Promise<any> {
		const params = {
			grant_type: 'authorization_code',
			code: code,
			client_id: process.env.FT_CLIENT_ID,
			client_secret: process.env.FT_CLIENT_SECRET,
			redirect_uri: 'http://127.0.0.1:3000/callback',
		};

		const data = new URLSearchParams(params);
		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			body: data,
		})
			.then((response) => response.json())
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		return response;
	}
	
	async handleCallback(response: any) {
		console.log('Response', response);
		const user: ftUser = await this.getUserInfo(response.access_token);
		const token = await this.signToken(user.user_id, user.email, response);
		const found = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			}
		});
		if (found) {
			await this.prisma.user.update({
				where: {
					email: user.email,
				},
				data: {
					jwt: token,
				},
			});
		} else {
			await this.prisma.user.create({
				data: {
					email: user.email,
					firstName: user.first_name,
					lastName: user.last_name,
					name: user.login,
					profilePicPath: user.image_url,
					jwt: token,
				},
			});
		}
		return token;
	}

	// async handleCallback(user: FortyTwoUser): Promise<any> {
	// 	console.table(user);
	// 	const found = await this.prisma.user.findUnique({
	// 		where: {
	// 			email: user.email,
	// 		},
	// 	});
	// 	if (found) {
	// 		this.signToken(found.id, found.email);
	// 		// res.cookie('auth', token);
    //   		// res.redirect('http://' + process.env.SERVER_URL + ':' + process.env.SERVER_PORT + '/home');
	// 		return found;
	// 	}
	// 	console.log('Creating new User...', user);
		
	// 	const newUser = await this.createUser(user);
	// 	this.signToken(newUser.id, newUser.email);

	// 	return newUser;
	// }

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

	// async signToken(userId: number, email: string) {
	// 	const payload = {
	// 		sub: userId,
	// 		email
	// 	};

	// 	const secret = this.config.get('JWT_SECRET');

	// 	const token = await this.jwt.sign(payload, {
	// 		// expiresIn: '15m',
	// 		secret: secret
	// 	});

	// 	console.log('Token', token);
	// 	await this.prisma.user.update({
	// 		where: {
	// 			email: email,
	// 		},
	// 		data:{
	// 			jwt: token,
	// 		},
	// 	});
	// }
	
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
