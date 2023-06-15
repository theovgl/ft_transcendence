import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as session from 'express-session';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
	}));
	app.use(cors(
		{
			origin: [
				'http://127.0.0.1:3000',
				'http://localhost:3000',
			],
			credentials: true,
			exposedHeaders: ['Authorization'],
		}
	));
	app.use(cookieParser());
	app.use(
		session({
		  secret: 'your-secret-key',
		  resave: false,
		  saveUninitialized: false,
		}),
	);
	await app.listen(4000);
}
bootstrap();
