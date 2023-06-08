import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { SessionSerializer } from './utils/auth.serializer';
import { ftStrategy } from './strategy/ftStrategy';

@Module({
	imports: [
		PrismaModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				// signOptions: { expiresIn: '1h' },
			}),
			inject: [ConfigService],
		}),
		ConfigModule,
	],
	providers: [AuthService, JwtStrategy, SessionSerializer, PrismaService, ftStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
