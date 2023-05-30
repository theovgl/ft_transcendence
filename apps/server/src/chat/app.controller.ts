import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './app.service';
import { MessageDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

	@Post('storeMessage')
	storeMessage(@Body() dto: MessageDto) {
		console.log({
			dto,
		});
	  return this.chatService.storeMessage(dto);
	}
	/*Definir les routes pour envoyer a prisma les messages
	Faire les routes avec POST du style /users/messages/add
	
	Mettre dans service les fonctions qui seront utilisées par le controller pour rendre le controller plus lisible
	**/
	
  //@Get()
  //getHello(): string {
  //  return this.appService.getHello();
  //}
}
