import { Controller, Get, Param, Post, Query, Redirect, Req, Res, Response, UseGuards } from '@nestjs/common';
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

	@Post('42/testCallback')
	// @UseGuards(ftAuthGuard)
	async handleTestCallback(@Query() query) {
		if(query.code !== undefined){
			const params = {
				grant_type: 'authorization_code',
				code: query.code,
				client_id: process.env.FT_CLIENT_ID,
				client_secret: process.env.FT_CLIENT_SECRET,
				redirect_uri: 'http://127.0.0.1:3000/callback',
			};

			const data = new URLSearchParams(params);
			const response = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				body: data,
			})
				.then((response) => response.json())
				.then((data) => {
					// console.log('Success:', data);
					return data;
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			console.log('response', response);
			// return {message: ret};
		}
	}

	@Get('42/callback')
	@UseGuards(ftAuthGuard)
	// @Redirect('http://localhost:3000/login', 301)
	async handleLoginCallback(@Req() req, @Response() res) {

		const user = await this.authService.handleCallback(req.user);
		const found = await this.prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});
		res.cookie('jwt', found.jwt, { httpOnly: true, secure: true });
		// console.log('Cookie', res);
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

