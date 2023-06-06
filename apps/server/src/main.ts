import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
	}));
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
