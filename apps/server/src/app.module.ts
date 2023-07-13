import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { GameModule } from './game/game.module';
import { StatusModule } from './status/status.module';

@Module({
	imports: [AuthModule, UserModule, PrismaModule, GameModule, FriendshipModule, MulterModule.register({
		storage: memoryStorage()
	}),
	UserModule, PrismaModule, LeaderboardModule, StatusModule,
	ConfigModule.forRoot({
		isGlobal: true
	}),],
})
export class AppModule {}
