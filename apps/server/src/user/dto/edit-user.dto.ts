import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class EditUserDto {
	@IsString()
	@IsNotEmpty()
	@IsAlphanumeric()
		newDisplayName: string;
}
