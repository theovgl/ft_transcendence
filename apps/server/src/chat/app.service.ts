import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async storeMessage(dto: MessageDto) {
	const message = await this.prisma.message.create({
	  data: {
		content: dto.content,
		authorId: dto.authorId,
		roomId: dto.roomId,
	  }
	});
	return message;
	// return { msg: 'New message created'};
  }

  getHello(): string {
    return 'Hello World!';
  }
}
