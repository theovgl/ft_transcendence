import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService, User, Room } from '../prisma/prisma.service';
import { MessageDto } from './dto';
import { Socket } from 'socket.io';
import { Message } from './app.interface';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  private clientList: Map<Socket, string> = new Map<Socket, string>()
  private currentRoomName = "";
  
  async onModuleInit()
  {
	this.createRoom('General');
	this.currentRoomName = 'General';
  }

  public async createRoom(room: string)
  {
	if (await this.prisma.room.findUnique({
		where: {
			name: room,
		}
	}))
		return;

	await this.prisma.room.create({
		data: {
			name: room,
		},
	})
  }

  public async loadRoom(client: Socket, room: string)
  {
	if (room !== this.currentRoomName)
	{
		console.log("client leaving : " + this.currentRoomName);
		console.log("client joining : " + room);
	}
	this.addUserToRoom(this.clientList.get(client), room)
	client.leave(this.currentRoomName);
	client.join(room);
	this.currentRoomName = room;
	// this.prisma.room.Update({
		
	// Put user in the room in the db
	// })
	const currentRoom = await this.prisma.room.findUnique({
		where: {
			name: room,
		},
		include: {
			messages: {
				include: {
				  author: true,
				  room: true
				},
			  },
		},
	});
	if (currentRoom) {
		currentRoom.messages.forEach((message) => {
			const msg: Message = {
				author: message.author.name,
				channel: message.room.name,
				message: message.content
			};
			client.emit('msgToClient', msg);
		});
	}
  }

  public async changeRoom(client: Socket, room: string)
  {
	this.createRoom(room);
	this.loadRoom(client, room);
  }

  async loadRoomlist(client: Socket)
  {
	const user = await this.findUser(this.clientList.get(client));
	if (user)
	{
		const talks = await this.prisma.talk.findMany({
			where: {
				userId: user.id,
			},
			include: {
				room: true,
			},
		})
		talks.forEach((talk) => {
			console.log('add Room: ' + talk.room.name + ' to user: ' + user.name);
			client.emit('loadRoom', talk.room.name);
		});
	}
	//get roomlist 
	//send room one by one
  }

  public async userConnection(client: Socket, room: string, payload: string)
  {
	await this.createRoom(room); 
	this.clientList.set(client, payload);
	await this.addUserToRoom(this.clientList.get(client), room);
	await this.loadRoomlist(client)
	await this.loadRoom(client, room);
	// await this.prisma.user.update({
	// 	where: {
	// 	},
	// })
  }

  public async userDisconnection(client: Socket)
  {
	this.clientList.delete(client)
  }

  async storeMessage(payload) {
	console.log("channel name : " + payload.channel);
	console.log("author name: " + payload.author);
	
	const author = await this.findUser(payload.author);

	const room = await this.findRoom(payload.channel);

	if (!author || !room)
	{
		console.log("author or room not found");
	}
	else {
		const message = await this.prisma.message.create({
		data: {
			content: payload.message,
			authorId: author.id,
			roomId: room.id,
		},
		include: {
			author: true,
			room: true,
		},
		});
		return message;
	}

	// return { msg: 'New message created'};
  }

  public async createDm(client: Socket, payload)
  {
	console.log('create room with : ' + payload);
	const username = this.clientList.get(client);
	const roomName = [username, payload].sort().join('');
	console.log('create Dm: ' + roomName);
	await this.createRoom(roomName);
	await this.addUserToRoom(this.clientList.get(client), roomName);
	await this.addUserToRoom(payload, roomName);
	await this.storeMessage({author: username, channel: roomName, message: "Clique sur play pour jouer avec moi !"});
	await this.loadRoom(client, roomName)
  }

//listen to an Event leaveRoom(in app.gateway)
public async leaveRoom(client: Socket, roomName: string){
	const user = await this.findUser(this.clientList.get((client)));
	const room = await this.findRoom(roomName);
	
	// if (user && room){
	// 	await this.prisma.talk.delete({
	// 		where: {
	// 			userId: user.id,
	// 			roomId: room.id
	// 		}
	// 	})
	// }
	client.emit('leaveRoom', roomName);
	//remove User from Room
}


async addUserToRoom(clientName: string, roomName: string) {
	const user = await this.findUser(clientName);
	const room = await this.findRoom(roomName);
	
	if (user && room)
	{
		for (const [client, userId] of this.clientList) {
			if (userId === clientName)
			{
				client.emit('loadRoom', room.name);
			}
		}
		if (
			await this.prisma.talk.findUnique({
				where: {
					userId_roomId: {
					userId: user.id,
					roomId: room.id,
					},
				}
			})
		)
			return ;
		await this.prisma.talk.create({
			data: {
				userId: user.id,
				roomId: room.id
			}
		})
	}

  }

  async deleteUserFromRoom() {

  }

  async findUser(userName: string): Promise<User | null>
  {
	return (await this.prisma.user.findUnique({
		where: {
			name: userName,
		}
	}))
  }
//   async findTalks(userName: string): Promise<T | null>
//   {
// 	return (await this.prisma.user.findUnique({
// 		where: {
// 			name: userName,
// 		}
// 	}))
//   }

  async	findRoom(roomName: string): Promise<Room | null>
  {
	return ( await this.prisma.room.findUnique({
		where: {
			name: roomName,
		}
	}))
  }

// OPTIONAL
// if no user delete the room (in app.gateway)
// 	deleteRoom(roomName)
// find room
// delete room

//add room status in Room model in prisma schema
//add behaviours depending on status in loadRoom

//add password in Room model
//add pssword behaviour in loadRoom

//Checkpassword(payload)
//Modifypassword(payload)
//Deletepassword(payload)

//blocked messages behaviour will be on front end

//Owner
//add owner in Room model
//if owner quits, the next admin become owner
//if no other admin, make the next user an owner and admin

//Kick
//Use the leaveRoom function

//Ban
//Same as Kick + ajouter au tableau Banned users
//add a check in loadRoom to prevent bannedusers to join

//Mute
//Prevent muted users to storeMessage

  getHello(): string {
    return 'Hello World!';
  }
}
