import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto';
import { Socket } from 'socket.io';
import { Message } from './app.interface';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit()
  {
	if (await this.prisma.room.findUnique({
		where: {
			name: 'general',
		}
	}))
		return;
	await this.prisma.room.create({
		data: {
			name: 'general',
		},
	})
  }

  public async userConnection(client: Socket, room: any)
  {
	client.join(room);
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
	// await this.prisma.user.update({
	// 	where: {
	// 	},
	// })
	
  }

  async storeMessage(payload) {
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

	console.log(author)
	console.log(room)
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
	// return { msg: 'New message created'};
  }

  getHello(): string {
    return 'Hello World!';
  }
}
