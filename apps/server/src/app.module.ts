import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './chat/app.controller';
import { AppService } from './chat/app.service';
import { AppGateway } from './chat/app.gateway';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
  }),],
	controllers: [AppController],
	providers: [AppService, AppGateway],
})
export class AppModule {}
