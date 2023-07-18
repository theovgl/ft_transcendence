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
			console.log("oui message");
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

  getHello(): string {
    return 'Hello World!';
  }
}
