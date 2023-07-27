import { IsNotEmpty, IsString } from 'class-validator';

export class roomCreationDto {
	@IsString()
	@IsNotEmpty()
		roomName: string;

	@IsNotEmpty()
	@IsString()
		status: string;

	@IsString()
		password?: string;
}