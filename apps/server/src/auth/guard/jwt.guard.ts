import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private readonly prisma: PrismaService) {
		super();
	  }

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	handleRequest(err, user) {
		if (err || !user) {
			// Handle authentication failure
			throw err || new UnauthorizedException();
		}

		let prismaUser = null;
		(async () => {
			try {
				prismaUser = await this.prisma.user.findUniqueOrThrow({ where: { id: user.id } });
				if (!prismaUser)
					throw new UnauthorizedException('Invalid user');
			} catch (error) {
				console.log('JwtGuard handleRequest error', error);
				throw error;
			}
		})();
		return prismaUser;
	}
}

export default JwtGuard;