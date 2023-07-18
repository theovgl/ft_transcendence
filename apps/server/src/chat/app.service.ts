import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto';
import { Socket } from 'socket.io';
import { Message } from './app.interface';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

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

  public async userConnection(client: Socket, room: string)
  {
	this.loadRoom(client, room)
	// await this.prisma.user.update({
	// 	where: {
	// 	},
	// })
  }

  async storeMessage(payload) {
	console.log("channel name : " + payload.channel);
	console.log("author name: " + payload.author);
	const author = await this.prisma.user.findUnique({
		where: {
			name: payload.author,
		}
	})
	const room = await this.prisma.room.findUnique({
		where: {
			name: payload.channel,
		}
	})

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

//	CreateDM(client: socket, payload: string)
//	create room name
//  createroom(roomname)
//	joinroo

//if no user delete the room (in app.gateway)
//listen to an Event leaveRoom(in app.gateway)

//leaveRoom(client: socket)
//delete from the users array in room entry
//emit to leave the room in front-end

//	deleteRoom(roomName)
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
//add admin which is an array of users in Room model
//if owner quits, the next admin become owner
//if no other admin, make the next user an owner and admin

//Kick
//Use the leaveRoom function

//Ban
//Same as Kick + ajouter au tableau Banned users
//add a banned users array in Room model
//add a check in loadRoom to prevent bannedusers to join

//Mute
//Add a muted users array in Room model
//Prevent muted users to storeMessage

  getHello(): string {
    return 'Hello World!';
  }
}
