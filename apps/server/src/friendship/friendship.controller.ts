import { Controller, Get, Query, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService) {}

	@Get('add')
	addFriend(@Query() qry) {
		this.friendshipService.handleAddFriend(qry.requesterName, qry.addresseeName);
		return;
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
}