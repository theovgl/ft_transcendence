//import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
//
//@WebSocketGateway()
//export class AppGateway {
//  @SubscribeMessage('message')
//  handleMessage(client: any, payload: any): string {
//    return 'Hello world!';
//  }
//}
import {
 SubscribeMessage,
 WebSocketGateway,
 OnGatewayInit,
 WebSocketServer,
 OnGatewayConnection,
 OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({cors: {origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4000']}})
export class ChatGateway {//implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// @WebSocketServer() server: Server;
 private logger: Logger = new Logger('ChatGateway');

 @SubscribeMessage('msgToServer')
 handleMessage(client: Socket, payload: string): void {
	 console.log("cool");
  //this.server.emit('msgToClient', payload);
 }

// afterInit(server: Server) {
//  this.logger.log('Init');
// }

 handleDisconnect(client: Socket) {
  this.logger.log(`Client disconnected: ${client.id}`);
 }

 handleConnection(client: Socket, ...args: any[]) {
  this.logger.log(`Client connected: ${client.id}`);
 }
}
