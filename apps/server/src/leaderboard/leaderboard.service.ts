import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
	constructor(private prisma: PrismaService) {}

	async getUsersWithHighestScores(): Promise<any> {
		return this.prisma.user.findMany({
			take: 50,
			orderBy: {
				wins: 'desc',
			},
			select: {
				name: true,
				wins: true
			}
		});
	}
}