import { BadRequestException, Body, Controller, Get, Param, Patch, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor (private userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':username')
	findOneByUsername(@Param('username') username: string) {
		return this.userService.findOneByUsername(username);
	}

	@Patch('edit')
	async edit(
		@Query() query,
		@Body() dto: EditUserDto,
	) {
		return await this.userService.editUser(query.user, dto);
	}

	@Patch('profile-picture')
	@UseInterceptors(FileInterceptor('profile-picture'))
	async uploadProfilePicture(@Res() res, @Query() query,  @Body() body, @UploadedFile() image: Express.Multer.File) {
		if (!image || !image.buffer)
			throw new BadRequestException('Invalid file');
		const result = await this.userService.uploadProfilePicture(query.user, image.buffer);
		res.json({ imageID : result });
	}

	@Get('profile-picture/:imageName')
	downloadProfilePicture(@Param('imageName') imageName: string, @Res() res): Observable<object> {
		return of(res.sendFile(process.env.UPLOADS_DESTINATION + '/profile-pictures/' + imageName));
	}
}

