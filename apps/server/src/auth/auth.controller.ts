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
	// @UseGuards(ftAuthGuard)
	async Callback(@Query() query, @Res({passthrough: true}) res) {
		if(query.code !== undefined){
			const response = await this.authService.exchangeCodeForToken(query.code);
			const jwt = await this.authService.handleCallback(response);
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.setHeader('Authorization', `Bearer ${jwt}`);
			res.cookie('jwt', jwt);
			res.status(200).send({ message: 'Login successful' });
		}
	}

	// @Get('42/callback')
	// @UseGuards(ftAuthGuard)
	// // @Redirect('http://localhost:3000/login', 301)
	// async handleLoginCallback(@Req() req, @Response() res) {

	// 	const user = await this.authService.handleCallback(req.user);
	// 	const found = await this.prisma.user.findUnique({
	// 		where: {
	// 			email: user.email,
	// 		},
	// 	});
	// 	res.cookie('jwt', found.jwt, { httpOnly: true, secure: true });
	// 	// console.log('Cookie', res);
	// 	// const token = user.jwt;
	// 	// res.cookie('jwt', token), { 
	// 	// 	maxAge: 2592000000,
	// 	// 	sameSite: true,
	// 	// 	secure: false,
	// 	// }
	// 	// console.log('Cookie', res.cookie);
	// 	return user;//
	// 	// console.log('HttpStatus', HttpStatus.OK, 'res.status', res.status);

	// 	// return res.status(HttpStatus.OK);
	// }

	@UseGuards(JwtGuard)
	@Get('42/test')
	test(@Req() req) {
		const user = req;
		console.log('user in test in auth.controller', user);
		return { message: req };
	}
}

