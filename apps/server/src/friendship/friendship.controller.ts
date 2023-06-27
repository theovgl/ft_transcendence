import { Controller, Get, Query, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService) {
		console.log('FriendshipController.constructor()');
	}

	@Get('add')
	addFriend(@Query() qry) {
		this.friendshipService.handleAddFriend(qry.qryuesterName, qry.addresseeName);
		return;
	}

	@Get('remove')
	removeFriend() {
		this.friendshipService.handleRemoveFriend();
		return;
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