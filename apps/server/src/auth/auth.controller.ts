import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { ftAuthGuard } from './guard/ft.guards';
import { PrismaService } from '../prisma/prisma.service';
import jwt_decode from 'jwt-decode';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private prisma: PrismaService) {}

	@Get('42/login')
	@UseGuards(ftAuthGuard)
	handleLogin() {
		return { message: 'Login successful' };
	}

	@Post('42/callback')
	async Callback(@Query('code') code: string, @Res({passthrough: true}) res) {
		if (!code) {
			res.status(400).send('Missing code');
			return;
		}

		try {
			const response = await this.authService.exchangeCodeForToken(code);
			const jwt = await this.authService.handleCallback(response);
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.cookie('jwt', jwt, {
				sameSite: 'strict'
			});
			res.status(200).send();
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal server error');
		}
	}

	@Post('2fa/generate')
	@UseGuards(JwtGuard)
	async register(@Res() res, @Req() req) {
		const user = jwt_decode(req.headers.authorization);
	  const { otpauthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(user);
  
	  return res.json(
			await this.authService.generateQrCodeDataURL(otpauthUrl),
	  );
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtGuard)
	async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
		const user = jwt_decode(req.headers.authorization);
	  const isCodeValid =
		this.authService.isTwoFactorAuthenticationCodeValid(
		  body.twoFactorAuthenticationCode,
		  user,
		);
	  if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

	  await this.authService.turnOnTwoFactorAuthentication(user);
	  return this.authService.loginWith2fa(user);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async authenticate(@Req() req, @Body() body) {
		const user = jwt_decode(req.headers.authorization);
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			user,
		);

		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

    	return this.authService.loginWith2fa(user);
	}

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req;
		return { message: req };
	}
}

