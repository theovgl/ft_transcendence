import { NestFactory } from '@nestjs/core';
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
				`http://${process.env.IP_ADDRESS}:3000`,
			],
			credentials: true,
		}
	));
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
