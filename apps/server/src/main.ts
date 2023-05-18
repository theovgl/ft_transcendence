import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { join } from 'path';

async function bootstrap() {
	//const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
	}));
	await app.listen(4000);
}
bootstrap();
