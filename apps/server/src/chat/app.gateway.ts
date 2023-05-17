import {
 SubscribeMessage,
 WebSocketGateway,
 OnGatewayInit,
 WebSocketServer,
 OnGatewayConnection,
 OnGatewayDisconnect,
} from '@nestjs/websockets';

import {Message} from './app.interface';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({cors: {origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4000']}})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
 @WebSocketServer() server: Server;
 private logger: Logger = new Logger('ChatGateway');

 //Message Events
 @SubscribeMessage('msgToServer')
 handleMessage(client: Socket, payload: String): void {
  this.server.emit('msgToClient', payload);
 }


 //Room Events
 @SubscribeMessage('CreateRoomfromServer')
 handleRoomCreation(client: Socket, payload: String): void {
	 this.server.emit('CreateRoomFromClient', payload)
 }

 @SubscribeMessage('ChangeRoomFromClient')
 handleRoomChange(client: Socket, payload: string): void {
	 this.server.emit('ChangeRoomFromServer', payload)
 }

 //WebSocket Log events
 afterInit(server: Server) {
  this.logger.log('Init');
 }

 handleDisconnect(client: Socket) {
  this.logger.log(`Client disconnected: ${client.id}`);
 }

 handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connected: ${client.id}`);
 }
}
