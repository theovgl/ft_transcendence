import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { join } from 'path';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	//app.useStaticAssets(join(__dirname, '..', 'static'));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
//	app.enableCors({
//		credentials: true,
//		origin
//		allowedHeaders: ['content-type'],
//	});
  await app.listen(4000);
}
bootstrap();
