import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard'
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

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
}

