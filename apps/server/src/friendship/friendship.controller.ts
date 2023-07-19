import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { Response } from 'express';
import { JwtGuard } from '../auth/guard';

@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService) {}
	
	@UseGuards(JwtGuard)
	@Get('add')
	async addFriend(@Query() qry, @Res() response: Response) {
		const ret = await this.friendshipService.handleAddFriend(qry.requesterName, qry.addresseeName);
		response
			.header('content-type', 'plain/text')
			.send(ret)
			.status(200);
	}

	@Get('remove')
	removeFriend(@Query() qry) {
		this.friendshipService.handleRemoveFriend(qry.requesterName, qry.addresseeName);
		return;
	}

	@Get('accept')
	acceptFriend(@Query() qry) {
		this.friendshipService.handleAcceptFriend(qry.requesterName, qry.addresseeName);
		return;
	}

	@Get('decline')
	declineFriend(@Query() qry) {
		this.friendshipService.handleDeclineFriend(qry.requesterName, qry.addresseeName);
		return;
	}

	@Get('block')
	blockFriend(@Query() qry) {
		this.friendshipService.handleBlockFriend(qry.requesterName, qry.addresseeName);
		return;
	}

	@Get('unblock')
	unblockFriend(@Query() qry) {
		this.friendshipService.handleUnblockFriend(qry.requesterName, qry.addresseeName);
		return;
	}

	@Get('getFriendList')
	getFriendList(@Query() qry) {
		return this.friendshipService.handleGetFriendList(qry.requesterName);
	}

	@Get('getBlockedList')
	getBlockedList(@Query() qry) {
		return this.friendshipService.handleGetBlockedList(qry.requesterName);
	}

	@Get('getSentRequestList')
	getSentRequestList(@Query() qry) {
		return this.friendshipService.handleGetSentRequestList(qry.requesterName);
	}

	@Get('getReceivedRequestList')
	getReceivedRequestList(@Query() qry) {
		return this.friendshipService.handleGetReceivedRequestList(qry.requesterName);
	}

	@Get('getRelationshipList')
	async getRelationshipList(@Query() qry) {
		const [friendship, blocked, request] = await Promise.all([
			await this.friendshipService.handleGetFriendList(qry.requesterName),
			await this.friendshipService.handleGetBlockedList(qry.requesterName),
			await this.friendshipService.handleGetReceivedRequestList(qry.requesterName)
		]);

		return {
			friendship,
			blocked,
			request
		};
	}

	@Get('getRelationship')
	async getRelationship(@Query() qry) {
		const status = await this.friendshipService.handleGetRelationship(qry.requesterName, qry.addresseeName);
		return status;
	}
}