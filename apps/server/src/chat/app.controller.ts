import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './app.service';
import { MessageDto } from './dto';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('storeMessage')
	storeMessage(@Body() dto: MessageDto) {
		return this.chatService.storeMessage(dto);
	}
}
