import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking.service';

@Injectable()
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
export class GameEvents  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	@WebSocketServer()
		server: Server;
	playersId: Map<Socket, string> = new Map();
	RoomsId: Map<Socket, string> = new Map();
	clientModeList: Map<Socket, string> = new Map();

	constructor (private matchmakingService: MatchmakingService){}

	afterInit(server: any) {
		this.matchmakingService.startMatchmaking(this.server);
	}

	//connexion
	handleConnection(client: Socket){}

	handleDisconnect(client: Socket){}

	@SubscribeMessage('quit')
	handleQuit(@MessageBody() data: string, @ConnectedSocket() client: Socket){
		this.matchmakingService.removePlayer(client, this.clientModeList.get(client), this.playersId.get(client));
		this.matchmakingService.removePremadePlayer(this.RoomsId.get(client));
		this.RoomsId.delete(client);
		this.clientModeList.delete(client);
		this.playersId.delete(client);
		this.matchmakingService.deleteBallService(client);
		client.emit('playerQuit');
	}

	//matchmaking even
	@SubscribeMessage('matchmaking')
	startMatchmaking(@MessageBody() data, @ConnectedSocket() client: Socket) {
		const userId: string = Array.isArray(data.query.userId)
			? data.query.userId[0]
			: data.query.userId.toString();
		const mode: string = Array.isArray(data.query.mode)
			? data.query.mode[0]
			: data.query.mode.toString();
		const premade: string = Array.isArray(data.query.premade)
			? data.query.premade[0]
			: data.query.premade.toString();
		if (premade !== '' && typeof premade !== 'undefined') {
			//ajouter au pool de premades
			//la pool à une id
			this.RoomsId.set(client, premade);
			this.matchmakingService.addPremadePlayer(client, mode, userId, premade, this.server);
		} else {
			if (this.matchmakingService.checkQueue(userId))
				client.emit('cancel');
			 else {
				client.emit('statusinGame', userId);
				this.clientModeList.set(client, mode);
				this.playersId.set(client, userId);
				this.matchmakingService.addPlayer(client, mode, userId);
			}
		}
		client.emit('searching');
	}
}