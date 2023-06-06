import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ftAuthGuard } from './guard/ft.guards';

@Controller('auth')
export class AuthController {
	@Get('42/login')
	@UseGuards(ftAuthGuard)
	handleLogin() {
		return {msg: 'Login with 42'};
	}

	@Get('42/callback')
	@UseGuards(ftAuthGuard)
	handleLoginCallback() {
		return {msg: 'Login with 42 callback'};
	}
	





	constructor(private authService: AuthService) {}
  @Post('signup')
	signup(@Body() dto: AuthDto) {
		console.log(({
			dto,
		}));
		return this.authService.signup(dto);
	}

  @Post('signin')
  signin(@Body() dto: AuthDto) {
  	return this.authService.signin(dto);
  }
}

