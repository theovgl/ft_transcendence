import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
	imports: [AuthModule, MulterModule.register({
		storage: memoryStorage()
	}),
	UserModule, PrismaModule,
	ConfigModule.forRoot({
		isGlobal: true
	}),],
})
export class AppModule {}
