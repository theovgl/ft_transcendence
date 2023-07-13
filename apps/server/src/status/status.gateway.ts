import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
import { emit } from 'process';

  @WebSocketGateway({ cors: { origin: '*', credentials: true }, })
  export class StatusGateway {
	@WebSocketServer() server: Server;

	private logger = new Logger('StatusGateway');
	private onlineUsers: Map<string, string> = new Map();

	@SubscribeMessage('statusUpdate')
	async handleStatusUpdate(@MessageBody() payload: string): Promise<void> {
		console.log('payload console', payload);
		this.logger.log('payload', payload);
		this.server.emit('statusUpdate', payload);
	}
	
	@SubscribeMessage('addConnectedUser')
	async handleUserConnected(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<string> {
		const setMap = await this.onlineUsers.set(client.id, data);
		this.server.emit('mapUpdated', this.onlineUsers.get(client.id));
		console.log('onlineUsers add', this.onlineUsers);
		return data;
	}

	// @SubscribeMessage('isConnected')
	// handleUserDisconnected(@MessageBody() data: string, @ConnectedSocket() client: Socket): boolean {
	// 	for (let value of this.onlineUsers.values()) {
	// 		if (value === data) {
	// 			return true
	// 		}
	// 	}
	// 	return false;
	// }
	// @SubscribeMessage('isUpdated')
	// handleIsUpdated(@MessageBody() data: any): boolean {
	// 	const name = this.onlineUsers.get(data);
	// 	for (let value of this.onlineUsers.values()) {
	// 		if (value === name) {
	// 			return true;
	// 		}
	// 	return false;
	// }
	// }


	@SubscribeMessage('isConnected')
	handleCheckUserStatus(@MessageBody() data: any): boolean {
		console.log('onlineUsers when checking for', data, this.onlineUsers);
		for (let value of this.onlineUsers.values()) {
			if (value === data) {
				return true;
			}
		}
		return false;
	}

	handleInit() {
		this.logger.log('Initialized!');
	}

	handleConnection(client: any, msg: MessageEvent, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		// this.onlineUsers.set(client.id, client.currentUser);
	}

	async handleDisconnect(client: any) {
		const username = this.onlineUsers.get(client.id);
		this.logger.log(`Client disconnected: ${client.id}`);
		console.log('get client id', username);
		if (username)
			await this.server.emit('mapUpdated', username);
		await this.onlineUsers.delete(client.id);
		console.log('onlineUsers delete', this.onlineUsers);
	}
  }  
