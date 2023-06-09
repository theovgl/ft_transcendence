import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { ftAuthGuard } from './guard/ft.guards';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('42/login')
	@UseGuards(ftAuthGuard)
	handleLogin() {
		return { message: 'Login successful' };
	}

	@Get('42/callback')
	@UseGuards(ftAuthGuard)
	async handleLoginCallback(@Req() req,/* @Res() res: Response*/) {

		const user = await this.authService.handleCallback(req.user);
		// const token = user.jwt;
		// res.cookie('jwt', token), { 
		// 	maxAge: 2592000000,
		// 	sameSite: true,
		// 	secure: false,
		// }
		// console.log('Cookie', res.cookie);
		return user;//
		// console.log('HttpStatus', HttpStatus.OK, 'res.status', res.status);

		// return res.status(HttpStatus.OK);
	}

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req;
		console.log('user in test in auth.controller', user);
		return { message: req };
	}
}

