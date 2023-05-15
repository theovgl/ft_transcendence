import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
//import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat/app.controller';
import { ChatService } from './chat/app.service';
import { ChatGateway } from './chat/app.gateway';

@Module({
  //imports: [AuthModule, UserModule, BookmarkModule, PrismaModule,
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
  }),],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway],
})
export class AppModule {}
