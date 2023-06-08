import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}
	
	// async signup(dto: AuthDto): Promise<User> {
	// 	console.log('signup service', dto);
	// 	// Create a new user in the database without storing a password
	// 	const newUser = await this.prisma.user.create({
	// 		data: {
	// 			email: dto.email,
	// 			name: dto.login,
	// 		},
	// 	});
	// 	return newUser;
	// }
	
	async handleCallback(user: FortyTwoUser): Promise<any> {
		console.table(user);
		const found = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		if (found)
		{
			this.signToken(found.id, found.email);
			return found;
		}
		console.log('Creating new User...', user);
		
		const newUser = await this.createUser(user);
		this.signToken(newUser.id, newUser.email);

		return newUser;
	}

	// 	const newUser = this.prisma.user.create({
	// 		data: {
	// 			email: user.email,
	// 			name: user.username,
	// 			firstName: user.firstName,
	// 			lastName: user.lastName,
	// 		},
	// });

		// Ici on ajoute à la DB miam 🤤
	// 	return newUser;
	// }

	// async signup(dto: AuthDto){
	// 	//generate the password hash
	// 	const hash = await argon.hash(dto.password);
	// 	// save the new user in DB
	// 	try {
	// 		const user = await this.prisma.user.create({
	// 			data: {
	// 				name: dto.,
	// 				email: dto.email,
	// 				hashedPassword: hash,
	// 			},
	// 		});

	// 		return this.signToken(user.id, user.email);
	// 	} catch(error) {
	// 		if (error.constructor.name === 'PrismaClientKnownRequestError'){
	// 			if (error.code === 'P2002')
	// 				throw new ForbiddenException('Credentials taken',);
	// 		}
	// 		throw error;
	// 	}
	// }
 
	// async signin(dto: AuthDto){
	// 	//find the user by email
	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			email: dto.email
	// 		}
	// 	});

	// 	//if user does not exist throw exception
	// 	if (!user)
	// 		throw new ForbiddenException('Credentials incorrect');

	// 	//compare password
	// 	const pwMatches = await argon.verify(user.hashedPassword, dto.password);

	// 	//if password incorrect throw exception
	// 	if (!pwMatches)
	// 		throw new ForbiddenException('Credentials incorrect');

	// 	return this.signToken(user.id, user.email);
	// }

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
		const updateUser = await this.prisma.user.update({
			where: {
				email: email,
			},
			data:{
				accessToken: token,
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

		// const newUser = await this.prisma.user.create({
		// 	data: {
		// 		email: details.email,
		// 		name: details.username,
		// 	},
		// });
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
