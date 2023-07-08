import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { MatchmakingService } from './matchmaking.service'
import { Injectable } from "@nestjs/common";
import { Client } from "socket.io/dist/client";

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameEvents  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;
    playersId: Map<Socket, string> = new Map();
    clientList: Map<Socket, string> = new Map();

    constructor (private matchmakingService: MatchmakingService){}

    afterInit(server: any) {
        this.matchmakingService.startMatchmaking(this.server);
    }
    //connexion
    handleConnection(client: Socket){
       console.log(`Client Connected: ${client.id}`);
        let userId: string = Array.isArray(client.handshake.query.userId)
                    ? client.handshake.query.userId[0]
                    : client.handshake.query.userId.toString();
        let mode: string = Array.isArray(client.handshake.query.mode)
                    ? client.handshake.query.mode[0]
                    : client.handshake.query.mode.toString();

        this.clientList.set(client, mode);
        console.log(`Client Connected: ${client.handshake.query.userId}`);
        this.playersId.set(client, userId)
        this.matchmakingService.addPlayer(client, mode, userId)
        client.emit('searching');
    }

    handleDisconnect(client: Socket){
        console.log(`Client Disconnected: ${client.id}`);
        this.matchmakingService.removePlayer(client, this.clientList.get(client), this.playersId.get(client))
        this.clientList.delete(client);
        this.playersId.delete(client);
        this.matchmakingService.deleteBallService(client)
    }

    //multiplayer event
    @SubscribeMessage('multiplayer')
    handleMatchmaking(@MessageBody() data: string, @ConnectedSocket() client: Socket){

    }

    //message event
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket){
        console.log("message received : " + data)
        this.server.emit('chat', client.id, data);
    }

}