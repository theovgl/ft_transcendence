import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
	imports: [AuthModule, UserModule, PrismaModule, FriendshipModule,
		ConfigModule.forRoot({
			isGlobal: true
		}),],
})
export class AppModule {}
