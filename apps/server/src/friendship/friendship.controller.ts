import { Controller, Get, Query, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService) {
		console.log('FriendshipController.constructor()');
	}

	@Get('add')
	addFriend(@Query() req) {
		this.friendshipService.handleAddFriend(req.requesterName, req.addresseeName);
		return;
	}

	@Get('remove')
	removeFriend() {
		return { message: 'Remove friend' };
	}

	@Get('accept')
	acceptFriend() {
		return { message: 'Accept friend' };
	}

	@Get('decline')
	declineFriend() {
		return { message: 'Decline friend' };
	}

	@Get('block')
	blockFriend() {
		return { message: 'Block friend' };
	}

	@Get('unblock')
	unblockFriend() {
		return { message: 'Unblock friend' };
	}
}