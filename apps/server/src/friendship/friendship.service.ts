import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { get } from 'http';

@Injectable()
export class FriendshipService {

	constructor(
		private prisma: PrismaService,
	) {}
	
	async getRequesterAddressee(requesterName: string, addresseeName: string) {
		const requester = await this.prisma.user.findUnique({
			where: {
				name: requesterName,
			},
		});
		const addressee = await this.prisma.user.findUnique({
			where: {
				name: addresseeName,
			},
		});
		return { requester, addressee };
	}

	async getFriendship(requester: any, addressee: any) {
		const friendship = await this.prisma.friendship.findUnique({
			where: {
				requesterId_addresseeId: {
					requesterId: requester.id,
					addresseeId: addressee.id,
				},
			},
		});
		console.log('Requester', requester, 'Addressee', addressee, 'Friendship')
		console.log('friendship', friendship);
		return friendship;
	}
	
	async handleAddFriend(requesterName: string, addresseeName: string) {
		console.log('requesterName', requesterName, 'addresseeName', addresseeName);
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		if (!requester || !addressee)
			return null;
		let friendship = await this.getFriendship(requester, addressee);
		if (!friendship) {
			console.log('Creating friendship...');
			friendship = await this.prisma.friendship.create({
				data: {
					requester: {
						connect: {
							id: requester.id,
						},
					},
					addressee: {
						connect: {
							id: addressee.id,
						},
					},
				},
			});
			return friendship;
		}
	}

	handleRemoveFriend() {
		return {
			message: 'Remove friend',
		};
	}

	handleAcceptFriend() {
		return {
			message: 'Accept friend',
		};
	}

	handleDeclineFriend() {
		return {
			message: 'Decline friend',
		};
	}

	handleBlockFriend() {
		return {
			message: 'Block friend',
		};
	}

	handleUnblockFriend() {
		return {
			message: 'Unblock friend',
		};
	}
}
