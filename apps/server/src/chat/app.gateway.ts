import {
 SubscribeMessage,
 WebSocketGateway,
 OnGatewayInit,
 WebSocketServer,
 OnGatewayConnection,
 OnGatewayDisconnect,
} from '@nestjs/websockets';

import { ChatService } from './app.service';

import {Message} from './app.interface';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
	  origin: ['https://hoppscotch.io', `http://${process.env.IP_ADDRESS}:3000`, `http://${process.env.IP_ADDRESS}:4000`],
	  methods: ['GET', 'POST'],
	  credentials: true,
	  allowedHeaders: ['Authorization', 'Content-Type'],
	  exposedHeaders: ['Authorization'],
	  allowEIO3: true,
	  allowEIO4: true,
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService) {}
 @WebSocketServer() server: Server;
 private logger: Logger = new Logger('ChatGateway');

 //Message Events
 @SubscribeMessage('msgToServer')
 async handleMessage(client: Socket, payload: Message) {
  if (await this.chatService.storeMessage(payload) === true)
	  this.server.to(payload.channel).emit('msgToClient', payload);
  // server.to(payload.channel).emit('msgToClient', payload.message);
 }

 @SubscribeMessage('leaveRoom')
 handleLeaveRoom(client: Socket, payload){
	this.chatService.leaveRoom(payload.clientName, payload.roomName)
 }

 @SubscribeMessage('sendDm')
 handleSendDm(client: Socket, payload){
	this.chatService.createDm(client, payload)
 }

 @SubscribeMessage('kick')
 handleKick(client: Socket, payload){
	this.chatService.kickUser(payload.kicked, payload.room);
 }

 @SubscribeMessage('ban')
 handleBan(client: Socket, payload){
	this.chatService.banUser(payload.banned, payload.room)
 }
 
 @SubscribeMessage('mute')
 handleMute(client: Socket, payload){
	this.chatService.muteUser(payload.muted, payload.room)
 }
 
 @SubscribeMessage('challenge')
 handleGameInvite(client: Socket, payload){
	console.log('challenge: ' + payload.challenged )
	this.chatService.createGameInvite(client, payload.challenged);
 }

 @SubscribeMessage('checkAdmin')
 handleCheckAdmin(client: Socket, payload: string): void {
	this.chatService.checkAdmin(client, payload);
 }

 //Room Events
 @SubscribeMessage('CreateRoomfromServer')
 handleRoomCreation(client: Socket, payload: String): void {
	 this.server.emit('CreateRoomFromClient', payload);
 }

 @SubscribeMessage('ChangeRoomFromClient')
 handleRoomChange(client: Socket, payload: string): void {
	this.chatService.changeRoom(client, payload);
	// this.server.emit('ChangeRoomFromServer', payload)
 }
 
 @SubscribeMessage('UserConnection')
 handleUserConnection(client: Socket, payload: string){
	setTimeout(() => {
		this.chatService.userConnection(client, 'General', payload);
	}, 150);
	// client.emit('userConnected')
	// Put user in General chat
	// Get messages from General
	// Emit the messages
  this.logger.log(`Client connected: ${client.id}`);
 }

 //WebSocket Log events
 afterInit(server: Server) {
  this.logger.log('Init');
 }

 handleDisconnect(client: Socket) {
  this.logger.log(`Client disconnected: ${client.id}`);
  this.chatService.userDisconnection(client)
 }

 handleConnection(client: Socket, ...args: any[]) {

 }
}
