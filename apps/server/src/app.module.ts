import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
  }),],
	controllers: [AppController],
	providers: [AppService, ChatGateway],
})
export class AppModule {}
