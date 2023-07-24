import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { BallService } from './ball.service';

const ONLINEMODE = 0;
const PLAYERMODE = 2;

@Injectable()
export class MatchmakingService {

	constructor(
		private prisma: PrismaService,
	) {}

	private waitingPlayers = new Map<string, Socket>();
	private waitingPlayerSpecial = new Map<string, Socket>();
	private premadePlayers = new Map<string, [string, Socket]>();
	private ballServices = new Set<BallService>();

	public addPlayer(player: Socket, mode: string, id: string): void {
		if (mode === 'Normal')
			this.waitingPlayers.set(id, player);
		 else if (mode === 'Special')
			this.waitingPlayerSpecial.set(id, player);

	}

	public removePlayer(player: Socket, mode: string, id: string): void {
		if (mode === 'Normal') {
			if (this.waitingPlayers.has(id) && this.waitingPlayers.get(id) === player)
				this.waitingPlayers.delete(id);

		} else if (mode === 'Special') {
			if (this.waitingPlayerSpecial.has(id) && this.waitingPlayerSpecial.get(id) === player)
				this.waitingPlayerSpecial.delete(id);

		}
	}

	public removePremadePlayer(roomId: string){
		this.premadePlayers.delete(roomId);
	}

	//first premade user connect
	//create a room and add player to it
	public addPremadePlayer(player: Socket, mode: string, id: string, roomId: string, server: Server) {
		if (this.premadePlayers.has(roomId)) {
			//set the players
			const playerOne = {
				socket: player,
				id: id,
				pos: { x: 100, y: 200 },
				rect: { x: 100, y: 200, width: 10, height: 10 },
			};

			const playerTwo = {
				socket: this.premadePlayers.get(roomId)[1],
				id: this.premadePlayers.get(roomId)[0],
				pos: { x: 860, y: 200 },
				rect: { x: 860, y: 200, width: 10, height: 10 },
			};

			//Create premade room
			const room = `${playerOne.id}-${playerTwo.id}}`;
			playerOne.socket.join(room);
			playerTwo.socket.join(room);
			playerOne.socket.emit('game-start', PLAYERMODE, ONLINEMODE);
			playerTwo.socket.emit('game-start', ONLINEMODE, PLAYERMODE);
			//launch the game
			const newBallService = new BallService(this.prisma);
			this.ballServices.add(newBallService);
			newBallService.setBallLoop(server, playerOne, playerTwo, room, 1, mode);
			//remove the player
			this.premadePlayers.delete(roomId);
		} else
			this.premadePlayers.set(roomId, [id, player]);

	}

	getRoomSockets(room: string, server: Server): Socket[] {
		const roomSockets = Array.from(server.sockets.adapter.rooms.get(room) || new Set());

		// Get socket objects from their IDs
		const sockets = roomSockets.map(socketId => server.sockets.sockets.get(String(socketId)));

		return sockets;
	}

	public deleteBallService(socket: Socket) {
		for (const ballService of this.ballServices) {
			if (ballService.containSocket(socket)) {
				if (!ballService.gameEnded)
					ballService.forfeit(socket);
				this.ballServices.delete(ballService);
				return ;
			}
		}
	}

	private matchPlayers(server: Server, waitingPlayers: Map<string, Socket>, mode: string): void {
		if (waitingPlayers.size >= 2) {
			const players = [...waitingPlayers.entries()].slice(0, 2);

			const playerOne = {
				socket: players[0][1],
				id: players[0][0],
				pos: { x: 100, y: 200 },
				rect: { x: 100, y: 200, width: 10, height: 10 },
			};

			const playerTwo = {
				socket: players[1][1],
				id: players[1][0],
				pos: { x: 860, y: 200 },
				rect: { x: 860, y: 200, width: 10, height: 10 },
			};

			waitingPlayers.delete(players[0][0]);
			waitingPlayers.delete(players[1][0]);

			const room = `${players[0][0]}-${players[1][0]}`;
			playerOne.socket.join(room);
			playerTwo.socket.join(room);
			playerOne.socket.emit('game-start', PLAYERMODE, ONLINEMODE);
			playerTwo.socket.emit('game-start', ONLINEMODE, PLAYERMODE);

			const newBallService = new BallService(this.prisma);
			this.ballServices.add(newBallService);
			newBallService.setBallLoop(server, playerOne, playerTwo, room, 1, mode);
		}
	}

	public checkQueue(userId: string){
		if (this.waitingPlayerSpecial.get(userId) !== undefined || this.waitingPlayers.get(userId) !== undefined)
			return true;
		return false;
	}
	private pingStatus(waitingPlayers: Map<string, Socket>): void {
		const values = waitingPlayers.values();

		for (const value of values)
			value.emit('statusinGame');

	}
	public startMatchmaking(server): void {
		setInterval(() => {
			this.pingStatus(this.waitingPlayerSpecial);
			this.pingStatus(this.waitingPlayers);
			this.matchPlayers(server, this.waitingPlayers, 'Normal');
			this.matchPlayers(server, this.waitingPlayerSpecial, 'Special');
		}, 5000);
	}
}
