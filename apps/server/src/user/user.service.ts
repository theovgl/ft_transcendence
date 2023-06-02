import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

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

	async uploadProfilePicture(userId: number, image: Buffer): Promise<void> {
		try {
			// Convert whatever image in webp format
			const convertedImage = await sharp(image, )
				.resize(400, 400)
				.toFormat('webp')
				.toBuffer();
	
			// Assign this image a unique name
			const uniqueFilename = uuidv4();
			const convertedImageFilename = `${uniqueFilename}.webp`; 
	
			// Create the right directory if it doesn't exists
			if (!fs.existsSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures`)) {
				fs.mkdirSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures`, { recursive: true })
			}

			// Save the file in that directory
			fs.writeFileSync(`${process.env.UPLOADS_DESTINATION}/profile-pictures/${convertedImageFilename}`, convertedImage);
			
			// Update user table with the location of the image
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					profilePicPath: `${process.env.UPLOADS_DESTINATION}/profile-pictures/${convertedImageFilename}`
				}
			});
		} catch (error) {
			console.error('An error occurred during file handling or database operation:', error);
			throw error;
		}
	}
}
