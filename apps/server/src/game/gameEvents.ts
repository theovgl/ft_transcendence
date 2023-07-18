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
        console.log(`Socket Disconnected: ${client.id}`);
        this.matchmakingService.removePlayer(client, this.clientModeList.get(client), this.playersId.get(client))
        this.matchmakingService.removePremadePlayer(this.RoomsId.get(client));
        this.RoomsId.delete(client);
        this.clientModeList.delete(client);
        this.playersId.delete(client);
        this.matchmakingService.deleteBallService(client)
    }

    //matchmaking even
    @SubscribeMessage('matchmaking')
    startMathmaking(@MessageBody() data, @ConnectedSocket() client: Socket)
    {
        console.log(`Socket Connected: ${client.id}`);
        const userId: string = Array.isArray(data.query.userId)
                    ? data.query.userId[0]
                    : data.query.userId.toString();
        const mode: string = Array.isArray(data.query.mode)
                    ? data.query.mode[0]
                    : data.query.mode.toString();
        const premade: string = Array.isArray(data.query.premade)
                    ? data.query.premade[0]
                    : data.query.premade.toString();
        console.log(`User Connected: ${data.query.userId}`);
        if (premade !== "" && typeof premade !== 'undefined') {
            console.log("premade with: " + premade);
            //ajouter au pool de premades
            //la pool à une id
            this.RoomsId.set(client, premade);
            this.matchmakingService.addPremadePlayer(client, mode, userId, premade, this.server)
        }
        else {
            this.clientModeList.set(client, mode);
            this.playersId.set(client, userId)
            this.matchmakingService.addPlayer(client, mode, userId)
        } 
        client.emit('searching');
    }
}