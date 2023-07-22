import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type FriendEntity = {
	name: string;
	profilePicPath: string;
};

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
		if (!requester || !addressee)
			return null;
		const friendship = await this.prisma.friendship.findUnique({
			where: {
				requesterId_addresseeId: {
					requesterId: requester.id,
					addresseeId: addressee.id,
				},
			}
		});
		return friendship;
	}
	
	async handleAddFriend(requesterName: string, addresseeName: string) {
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		if (!requester || !addressee)
			return null;
		let requested = await this.getFriendship(addressee, requester);
		let friendship = await this.getFriendship(requester, addressee);
		if ((!requested && !friendship) || requested.status === 'BLOCKED' ) {
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
		const requested = await this.getFriendship(addressee, requester);
		if (requested && requested.status === 'ACCEPTED') {
			return this.prisma.friendship.delete({
				where: {
					requesterId_addresseeId: {
						requesterId: requested.requesterId,
						addresseeId: requested.addresseeId,
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

	async handleGetFriendList(requesterName: string): Promise<FriendEntity[]> {
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
			select: {
				requester: {
					select: {
						name: true,
						profilePicPath: true,
					}
				},
				addressee: {
					select: {
						name: true,
						profilePicPath: true,
					}
				},
			}
		});

		const friends: FriendEntity[] = [];

		friendList.forEach(friendship => {
			if (friendship.addressee.name != requesterName) {
				const friend: FriendEntity = {
					name: friendship.addressee.name,
					profilePicPath: friendship.addressee.profilePicPath,
				};
				friends.push(friend);
			} else if (friendship.requester.name != requesterName) {
				const friend: FriendEntity = {
					name: friendship.requester.name,
					profilePicPath: friendship.requester.profilePicPath,
				};
				friends.push(friend);
			}
		});
		return friends;
	}

	async handleGetBlockedList(requesterName: string): Promise<FriendEntity[]> {
		if (!requesterName)
			return null;
		const blockedList = await this.prisma.friendship.findMany({
			where: {
				requester: {
					name: requesterName,
				},
				status: 'BLOCKED',
			},
			select: {
				requester: {
					select: {
						name: true,
						profilePicPath: true,
					}
				},
				addressee: {
					select: {
						name: true,
						profilePicPath: true,
					}
				},
			}
		});

		const formatedBlockedList: FriendEntity[] = [];

		blockedList.forEach(blockedUser => {
			if (blockedUser.addressee.name != requesterName) {
				const relation: FriendEntity = {
					name: blockedUser.addressee.name,
					profilePicPath: blockedUser.addressee.profilePicPath,
				};
				formatedBlockedList.push(relation);
			} else if (blockedUser.requester.name != requesterName) {
				const relation: FriendEntity = {
					name: blockedUser.requester.name,
					profilePicPath: blockedUser.requester.profilePicPath,
				};
				formatedBlockedList.push(relation);
			}
		});
		return formatedBlockedList;
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
		return sentRequestList;
	}

	async handleGetReceivedRequestList(requesterName: string): Promise<FriendEntity[]> {
		if (!requesterName)
			return null;

		const receivedRequestList = await this.prisma.friendship.findMany({
			where: {
				addressee: {
					name: requesterName,
				},
				status: 'PENDING',
			},
			select: {
				requester: {
					select: {
						name: true,
						profilePicPath: true,
					}
				},
			}
		});

		const formatedRequestList: FriendEntity[] = [];

		receivedRequestList.forEach(request => {
			const relation: FriendEntity = {
				name: request.requester.name,
				profilePicPath: request.requester.profilePicPath,
			};
			formatedRequestList.push(relation);
		});
		return formatedRequestList;
	}

	async handleGetRelationship(requesterName: string, addresseeName: string) {
		if (!requesterName || !addresseeName)
			return null;
		const { requester, addressee } = await this.getRequesterAddressee(requesterName, addresseeName);
		let friendship = await this.getFriendship(requester, addressee);
		if (friendship)
			return friendship.status;
		friendship = await this.getFriendship(addressee, requester);
		if (!friendship)
			return 'EMPTY';
		if (friendship.status === 'PENDING')
			return 'RECEIVED';
		else if (friendship.status === 'ACCEPTED')
			return friendship.status;
		return 'EMPTY';
	}
}
