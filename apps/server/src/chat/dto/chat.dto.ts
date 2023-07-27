import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MessageDto {
	@IsNotEmpty()
	@IsString()
		content: string;

	@IsNumber()
	@IsNotEmpty()
		authorId: number;

	@IsString()
	@IsNotEmpty()
		roomId: string;
}