import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async editUser(userId: number, dto: EditUserDto) {
		const user = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...dto,
			},
		});
		delete user.hashedPassword;
		return user;
	}

	async findAll() {
		const users = await this.prisma.user.findMany();

		return users;
	}

	async findOneByUsername(username: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				name: username,
			}
		});

		if(!user)
			throw new NotFoundException('User: ' + username + ' does not exists');
		delete user.hashedPassword;
		return user;
	}
}
