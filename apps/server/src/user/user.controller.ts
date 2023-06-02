import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../auth/guard'
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

//@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor (private userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':username')
	findOneByUsername(@Param('username') username: string) {
		console.log(username);
		return this.userService.findOneByUsername(username);
	}

	@Get('me')
	getMe(@GetUser() user: User, @GetUser('email') email: string){
		console.log({
			email,
		});
		return user;
	}

	@Patch()
	editUser(
		@GetUser('id') userId: number,
		@Body() dto: EditUserDto,
	) {
		return this.userService.editUser(userId, dto);
	}

	@Post('profile-picture')
	@UseInterceptors(FileInterceptor('profile-picture'))
	async uploadProfilePicture(@UploadedFile() image: Express.Multer.File) {
		if (!image || !image.buffer) {
			throw new BadRequestException('Invalid file');
		}

		await this.userService.uploadProfilePicture(1, image.buffer);
		return { message: 'Profile picture uploaded successfully' };
	}
}

