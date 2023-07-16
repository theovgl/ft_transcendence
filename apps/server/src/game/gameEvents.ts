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
    clientModeList: Map<Socket, string> = new Map();

    constructor (private matchmakingService: MatchmakingService){}

    afterInit(server: any) {
        this.matchmakingService.startMatchmaking(this.server);
    }
    //connexion
    handleConnection(client: Socket){
       console.log(`Socket Connected: ${client.id}`);
        let userId: string = Array.isArray(client.handshake.query.userId)
                    ? client.handshake.query.userId[0]
                    : client.handshake.query.userId.toString();
        let mode: string = Array.isArray(client.handshake.query.mode)
                    ? client.handshake.query.mode[0]
                    : client.handshake.query.mode.toString();
        let premade: string = Array.isArray(client.handshake.query.premade)
                    ? client.handshake.query.premade[0]
                    : client.handshake.query.premade.toString();
        console.log(`User Connected: ${client.handshake.query.userId}`);
        if (premade != "") {
            console.log("premade with: " + premade);
            //ajouter au pool de premades
            //la pool à une id
            this.matchmakingService.addPremadePlayer(client, mode, userId, premade, this.server)
        }
        else {
            this.clientModeList.set(client, mode);
            this.playersId.set(client, userId)
            this.matchmakingService.addPlayer(client, mode, userId)
        }
       
        client.emit('searching');           
    }

    handleDisconnect(client: Socket){
        console.log(`Socket Disconnected: ${client.id}`);
        this.matchmakingService.removePlayer(client, this.clientModeList.get(client), this.playersId.get(client))
        this.clientModeList.delete(client);
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