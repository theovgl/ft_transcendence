import { Body, Controller, Get, Header, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtGuard } from './guard';
import { ftAuthGuard } from './guard/ft.guards';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('42/login')
	@UseGuards(ftAuthGuard)
	handleLogin() {
		return { message: 'Login successful' }; // Je pense que c'est pas utile
	}

	@Get('42/callback')
	@UseGuards(ftAuthGuard)
	handleLoginCallback(@Req() req) {
		return this.authService.handleCallback(req.user);
	}

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req.user;
		console.log('user in test in auth.controller', user);
		return { message: 'Accessed test page' };
	}
	
	// @Post('signup')
	// async signup(@Body() dto: AuthDto) {
	// 	await this.authService.signup(dto);
	// 	return { message: 'Signup successful' };
	// }

	// constructor(private authService: AuthService) {}
	// @Post('signup')
	// signup(@Body() dto: AuthDto) {
	// 	console.log(({
	// 		dto,
	// 	}));
	// 	return this.authService.signup(dto);
	// }

	// @Post('signin')
	// signin(@Body() dto: AuthDto) {
	// 	return this.authService.signin(dto);
	// }
}

