import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageDto {
  content: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}