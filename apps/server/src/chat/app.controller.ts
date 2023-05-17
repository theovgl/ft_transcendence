import { Controller, Get } from '@nestjs/common';
import { ChatService } from './app.service';

@Controller()
export class ChatController {
  constructor(private readonly appService: ChatService) {}

	/*Definir les routes pour envoyer a prisma les messages
	Faire les routes avec POST du style /users/messages/add
	
	Mettre dans service les fonctions qui seront utilisées par le controller pour rendre le controller plus lisible
	**/
	
  //@Get()
  //getHello(): string {
  //  return this.appService.getHello();
  //}
}
