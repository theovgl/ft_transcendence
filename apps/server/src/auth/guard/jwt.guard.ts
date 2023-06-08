import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private readonly prisma: PrismaService) {
		super();
	  }

  canActivate(context: ExecutionContext) {
	console.log('JwtGuard canActivate');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
	console.log('JwtGuard handleRequest', 'err', err, 'user', user, 'info', info);

	console.log('CReating prismaUser');
	const prismaUser = this.prisma.user.findUniqueOrThrow({ where: { id: user.id } });
	console.log('prismaUser', prismaUser);

	if (!prismaUser) {
		throw new UnauthorizedException('Invalid user');
	}
    if (err || !user) { 
		console.log('JwtGuard handleRequest err');
      // Handle authentication failure
      throw err || new UnauthorizedException();
    }

    // Authentication success, return the user
    return user;
  }
}

export default JwtGuard;