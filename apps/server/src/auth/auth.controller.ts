import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard';
import { ftAuthGuard } from './guard/ft.guards';
import { PrismaService } from '../prisma/prisma.service';

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
				httpOnly: true,
				sameSite: 'strict'
			});
			res.status(200).send();
		} catch (error) {
			console.error(error);
			res.statuts(500).send('Internal server error');
		}
	}

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req;
		console.log('user in test in auth.controller', user);
		return { message: req };
	}
}

