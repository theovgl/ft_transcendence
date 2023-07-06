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
		console.log('ret:\n', ret);
		response
			.send(ret)
			.header('content-type', 'plain/text')
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
	getRelationshipList(@Query() qry) {
		return {
			friendList: this.friendshipService.handleGetFriendList(qry.requesterName),
			blockedList: this.friendshipService.handleGetBlockedList(qry.requesterName),
			sentRequestList: this.friendshipService.handleGetSentRequestList(qry.requesterName),
			receivedRequestList: this.friendshipService.handleGetReceivedRequestList(qry.requesterName),
		};
	}

	@Get('getRelationship')
	async getRelationship(@Query() qry) {
		console.log('qry:\n', qry);
		const status = await this.friendshipService.handleGetRelationship(qry.requesterName, qry.addresseeName);
		console.log('status:\n', status);
		return status;
	}
}