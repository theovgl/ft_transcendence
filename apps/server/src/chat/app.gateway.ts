import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { ChatService } from './app.service';

import { Message } from './app.interface';

import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
	  origin: ['https://hoppscotch.io', `http://${process.env.IP_ADDRESS}:3000`, `http://${process.env.IP_ADDRESS}:4000`],
	  methods: ['GET', 'POST'],
	  credentials: true,
	  transport: ['websocket', 'polling'],
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
	await this.chatService.storeMessageAndSend(client, payload, this.server);
 }

 @SubscribeMessage('leaveRoom')
 handleLeaveRoom(client: Socket, payload){
	this.chatService.leaveRoom(payload.clientName, payload.roomName)
 }

 @SubscribeMessage('startDm')
 handleSendDm(client: Socket, payload){
	this.chatService.createDm(client, payload.clientName, payload.receiverName)
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

 @SubscribeMessage('createRoom')
 handleCreateRoom(client: Socket, payload: {roomName: string, status: string, password ?: string}): void {
	this.chatService.roomCreation(client, payload.roomName, payload.status, payload.password);
 }
 
 @SubscribeMessage('setUserAdmin')
 handleSetUserAdmin(client: Socket, payload: string){
	this.chatService.setAdmin(client, payload);
 }
 
 //Room Events
 @SubscribeMessage('CreateRoomfromServer')
 handleRoomCreation(client: Socket, payload: String): void {
	 this.server.emit('CreateRoomFromClient', payload);
 }

 @SubscribeMessage('ChangeRoomFromClient')
 handleRoomChange(client: Socket, payload: string): void {
	this.chatService.changeRoom(client, payload);
 }
 
 private clientList: Map<Socket, string> = new Map();
 @SubscribeMessage('UserConnection')
 async handleUserConnection(client: Socket, payload: {username: string, dmReceiverName?: string}){
	if (this.clientList.get(client))
	{
		this.chatService.userReconnection(client, payload.username, payload.dmReceiverName)
		console.log("already registered in chat");
		return ;
	}
	console.log("registering in chat: " + client)
	this.clientList.set(client, payload.username)
	await this.chatService.userConnection(client, "General", payload.username, payload?.dmReceiverName);

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
