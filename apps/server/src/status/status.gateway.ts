import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';

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
	
	@SubscribeMessage('userConnected')
	handleUserConnected(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
		console.log('Connected data', data);
		this.onlineUsers.set(client.id, data);
		console.log('onlineUsers console', this.onlineUsers);
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

	@SubscribeMessage('isConnected')
	handleCheckUserStatus(@MessageBody() data: any): boolean {
    return this.onlineUsers.has(data);
	}

	handleInit() {
		this.logger.log('Initialized!');
	}

	handleConnection(client: any, msg: MessageEvent, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		// this.onlineUsers.set(client.id, client.currentUser);
	}

	handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.onlineUsers.delete(client.id);
		console.log('onlineUsers console updated', this.onlineUsers);
	}
  }  
