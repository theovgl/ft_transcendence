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
	
	async handleCallback(user: FortyTwoUser): Promise<any> {
		console.table(user);
		const found = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		if (found) {
			this.signToken(found.id, found.email);
			// res.cookie('auth', token);
      		// res.redirect('http://' + process.env.SERVER_URL + ':' + process.env.SERVER_PORT + '/home');
			return found;
		}
		console.log('Creating new User...', user);
		
		const newUser = await this.createUser(user);
		this.signToken(newUser.id, newUser.email);

		return newUser;
	}

	async signToken(userId: number, email: string) {
		const payload = {
			sub: userId,
			email
		};

		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.sign(payload, {
			// expiresIn: '15m',
			secret: secret
		});

		console.log('Token', token);
		await this.prisma.user.update({
			where: {
				email: email,
			},
			data:{
				jwt: token,
			},
		});
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
