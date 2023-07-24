import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async editUser(name: string, dto: EditUserDto) {
		console.log(name);

		const existingUser = await this.prisma.user.findUnique({
			where: {
				displayName: dto.newDisplayName
			}
		});

		if (existingUser && existingUser.name !== name)
			throw new ConflictException('Display name already in use');

		const updatedUser = await this.prisma.user.update({
			where: {
				name: name
			},
			data: {
				displayName: dto.newDisplayName
			},
		});
		return updatedUser;
	}

	async findAll() {
		const users = await this.prisma.user.findMany();

		return users;
	}

	async findOneByUsername(username: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				name: username,
			},
			select: {
				id: true,
				name: true,
				displayName: true,
				firstName: true,
				lastName: true,
				profilePicPath: true,
				wins: true,
				losses: true,
				level: true,
				twoFAEnabled: true,
			}
		});

		if (!user)
			throw new NotFoundException('User: ' + username + ' does not exists');
		return user;
	}

	async uploadProfilePicture(username: string, image: Buffer): Promise<string> {
		try {
			// Convert whatever image in webp format
			const convertedImage = await sharp(image)
				.resize(400, 400, {
					fit: 'cover'
				})
				.webp({
					nearLossless: true
				})
				.toBuffer();

			// Assign this image a unique name
			const uniqueFilename = uuidv4();
			const convertedImageFilename = `${uniqueFilename}.webp`;

			// Create the right directory if it doesn't exists
			if (!fs.existsSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures`))
				fs.mkdirSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures`, { recursive: true });

			// Save the file in that directory
			fs.writeFileSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures/${convertedImageFilename}`, convertedImage);

			// Update user table with the location of the image
			await this.prisma.user.update({
				where: {
					name: username
				},
				data: {
					profilePicPath: `/images/profile-pictures/${convertedImageFilename}`
				}
			});

			return convertedImageFilename;
		} catch (error) {
			console.error('An error occurred during file handling or database operation:', error);
			throw error;
		}
	}
}
