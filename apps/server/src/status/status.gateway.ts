import { ConnectedSocket, MessageBody,SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

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
export class StatusGateway {
@WebSocketServer() server: Server;
private logger = new Logger('StatusGateway');
private onlineUsers: Map<string, string> = new Map();
private onlineUsersInGame: Map<string, string> = new Map();
	
	@SubscribeMessage('addConnectedUser')
async handleUserConnected(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<string> {
	await this.onlineUsers.set(client.id, data);
	this.server.emit('mapUpdated', this.onlineUsers.get(client.id));
	return data;
}

	@SubscribeMessage('removeConnectedUser')
	async handleUserDisconnected(@MessageBody() data: string) {
		this.onlineUsers.forEach((value:string, key: string)=> {
			if (value === data) {
				this.onlineUsers.delete(key);
				this.server.emit('mapUpdated', data);
			}
		});
	}
	
	@SubscribeMessage('inGame')
	async handleInGame(@ConnectedSocket() client: Socket) {
		const username = this.onlineUsers.get(client.id);
		if (username)
		{
			this.onlineUsersInGame.set(client.id, username);
			this.server.emit('isInGame', username);
		}
	}

	
	@SubscribeMessage('quitGame')
	async handleQuitGame(@ConnectedSocket() client: Socket) {
		const username = this.onlineUsers.get(client.id);
		if (username)
		{
			this.onlineUsersInGame.forEach((value:string, key: string)=> {
				if (value === username) {
					this.onlineUsersInGame.delete(key);
				}
			});
			this.server.emit('quitInGame', { username: username, status: 'Online'});
		}
	}

	@SubscribeMessage('isConnected')
	handleCheckUserStatus(@MessageBody() data: any): boolean {
		for (const value of this.onlineUsersInGame.values()) {
			if (value === data)
			{
				this.server.emit('isInGame', data);
			}
		}
		for (const value of this.onlineUsers.values()) {
			if (value === data)
				return true;
		}
		return false;
	}

	handleConnection(client: any, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: any) {
		const username = this.onlineUsers.get(client.id);
		if (username)
			await this.server.emit('mapUpdated', username);
		await this.onlineUsers.delete(client.id);
	}
}
