import { Server, Socket } from 'socket.io';
import { Injectable } from "@nestjs/common";
import { BallService } from './ball.service';

const ONLINEMODE = 0;
const PLAYERMODE = 2;

@Injectable()
export class MatchmakingService {
  private waitingPlayers = new Set<[string, Socket]>();
  private waitingPlayerSpecial = new Set<[string, Socket]>();
  private ballServices = new Set<BallService>();

  public addPlayer(player: Socket, mode: string, id: string): void {
    if (mode === "Normal")
      this.waitingPlayers.add([id,player]);
    else if (mode === "Special")
      this.waitingPlayerSpecial.add([id,player]);
  }

  public removePlayer(player: Socket, mode: string, id: string): void {
        //Do something
        if (mode === "Normal")
          this.waitingPlayers.delete([id,player])
        else if (mode === "Special")
          this.waitingPlayerSpecial.delete([id,player])
    }

  getRoomSockets(room: string, server: Server): Socket[] {
    const roomSockets = Array.from(server.sockets.adapter.rooms.get(room) || new Set());

    // Get socket objects from their IDs
    const sockets = roomSockets.map(socketId => server.sockets.sockets.get(String(socketId)));

    return sockets;
  }

  public deleteBallService(socket: Socket)
  {
    for (const ballService of this.ballServices) {
      if (ballService.containSocket(socket))
      {
        console.log("delete ballservice");
        ballService.forfeit();
        this.ballServices.delete(ballService)
        return ;
      }
    }
  }

  private matchPlayers(server: Server, waitingPlayers: Set<[string, Socket]>, mode: string): void {
    //const players = Array.from(this.waitingPlayers);

    if (waitingPlayers.size >= 2) {
        const [player1, player2] = 
        [...waitingPlayers.values()].slice(0, 2);

        const playerOne = {
          socket: player1[1],
          id: player1[0],
          pos: {x: 100, y: 200},
          rect: {x: 100, y: 200, width: 10, height: 10}
        }

        const playerTwo = {
          socket: player2[1],
          id: player2[0],
          pos: {x: 860, y: 200},
          rect: {x: 860, y: 200, width: 10, height: 10}
        }
        waitingPlayers.delete(player1);
        waitingPlayers.delete(player2);

        console.log("Match found !")
        // create a new room for the players to play
        const room = `${player1[0]}-${player2[0]}`;
        playerOne.socket.join(room);
        playerTwo.socket.join(room);
        // notify the players that the game has started
        player1[1].emit('game-start', PLAYERMODE, ONLINEMODE);
        player2[1].emit('game-start', ONLINEMODE, PLAYERMODE);

        const newBallService = new BallService();

        this.ballServices.add(newBallService);
        newBallService.setBallLoop(server, playerOne, playerTwo, room, 1, mode)
    }
  }

  public startMatchmaking(server): void {
    setInterval(() => {
      this.matchPlayers(server, this.waitingPlayers, "Normal");
      this.matchPlayers(server, this.waitingPlayerSpecial, "Special");
    }, 5000);
  }
}
