import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
		return friendship;
	}
	
	async handleAddFriend(requesterName: string, addresseeName: string) {
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		if (!requester || !addressee)
			return null;
		let requested = await this.getFriendship(addressee, requester);
		let friendship = await this.getFriendship(requester, addressee);
		if (!requested && !friendship) {
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
		} else if (requested && !friendship) {
			if (requested.status == 'PENDING') {
				requested = await this.prisma.friendship.update({
					where: {
						requesterId_addresseeId: {
							requesterId: requested.requesterId,
							addresseeId: requested.addresseeId,
						},
					},
					data: {
						status: 'ACCEPTED',
					},
				});
			}
			return friendship;
		}
	}

	async handleRemoveFriend(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		const friendship = await this.getFriendship(requester, addressee);
		if (friendship && friendship.status === 'ACCEPTED') {
			return this.prisma.friendship.delete({
				where: {
					requesterId_addresseeId: {
						requesterId: friendship.requesterId,
						addresseeId: friendship.addresseeId,
					},
				},
			});
		}
		return;
	}

	async handleAcceptFriend(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		const friendship = await this.getFriendship(addressee, requester);
		if (friendship 
			&& friendship.status === 'PENDING') {
			return this.prisma.friendship.update({
				where: {
					requesterId_addresseeId: {
						requesterId: friendship.requesterId,
						addresseeId: friendship.addresseeId,
					},
				},
				data: {
					status: 'ACCEPTED',
				},
			});
		}

		return;
	}

	async handleDeclineFriend(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		const friendship = await this.getFriendship(requester, addressee);
		if (friendship && friendship.status === 'PENDING') {
			return this.prisma.friendship.delete({
				where: {
					requesterId_addresseeId: {
						requesterId: friendship.requesterId,
						addresseeId: friendship.addresseeId,
					},
				},
			});
		}
		return;
	}

	async handleBlockFriend(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		if (!requester || !addressee)
			return null;
		let friendship = await this.getFriendship(requester, addressee);
		if (!friendship) {
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
					status: 'BLOCKED',
				},
			});
		} else {
			return this.prisma.friendship.update({
				where: {
					requesterId_addresseeId: {
						requesterId: friendship.requesterId,
						addresseeId: friendship.addresseeId,
					},
				},
				data: {
					status: 'BLOCKED',
				},
			});
		}
		return;
	}

	async handleUnblockFriend(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		const friendship = await this.getFriendship(requester, addressee);
		if (friendship && friendship.status === 'BLOCKED') {
			return this.prisma.friendship.delete({
				where: {
					requesterId_addresseeId: {
						requesterId: friendship.requesterId,
						addresseeId: friendship.addresseeId,
					},
				},
			});
		}
		return;
	}

	async handleGetFriendList(requesterName: string) {
		if (!requesterName)
			return null;
		const friendList = await this.prisma.friendship.findMany({
			where: {
				OR: [
					{
						requester: {
							name: requesterName,
						},
					},
					{
						addressee: {
							name: requesterName,
						},
					},
				],
				status: 'ACCEPTED',
			},
		});
		console.log(friendList);
		return friendList;
	}

	async handleGetBlockedList(requesterName: string) {
		if (!requesterName)
			return null;
		const blockedList = await this.prisma.friendship.findMany({
			where: {
				requester: {
					name: requesterName,
				},
				status: 'BLOCKED',
			},
		});
		console.log(blockedList);
		return blockedList;
	}

	async handleGetSentRequestList(requesterName: string) {
		if (!requesterName)
			return null;
		const sentRequestList = await this.prisma.friendship.findMany({
			where: {
				requester: {
					name: requesterName,
				},
				status: 'PENDING',
			},
		});
		console.log(sentRequestList);
		return sentRequestList;
	}

	async handleGetReceivedRequestList(requesterName: string) {
		if (!requesterName)
			return null;
		const receivedRequestList = await this.prisma.friendship.findMany({
			where: {
				addressee: {
					name: requesterName,
				},
				status: 'PENDING',
			},
		});
		console.log(receivedRequestList);
		return receivedRequestList;
	}
}