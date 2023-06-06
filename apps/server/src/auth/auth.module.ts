import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { ftStrategy } from './strategy/ftStrategy';

@Module({
	imports: [JwtModule.register({})],
	providers: [AuthService, JwtStrategy, ftStrategy],
	controllers: [AuthController]
})
export class   AuthModule{}