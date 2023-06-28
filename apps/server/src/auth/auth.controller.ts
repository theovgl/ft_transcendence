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
		console.log('req in generate', jwt_decode(req.rawHeaders[7]));
		console.log('req.user. in generate', jwt_decode(req.headers.authorization));
		const user = jwt_decode(req.headers.authorization);
	  const { otpauthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(user);
  
	  return res.json(
			await this.authService.generateQrCodeDataURL(otpauthUrl),
	  );
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtGuard)
	async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
	  const isCodeValid =
		this.authService.isTwoFactorAuthenticationCodeValid(
		  body.twoFactorAuthenticationCode,
		  req.user,
		);
	  if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

	  await this.authService.turnOnTwoFactorAuthentication(req.user.id);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async authenticate(@Req() req, @Body() body) {
		const user = jwt_decode(req.headers.authorization);
console.log('user in authenticate', user);

		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			user,
		);

		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

    	return this.authService.loginWith2fa(req.user);
	}

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req;
		console.log('user in test in auth.controller', user);
		return { message: req };
	}
}

