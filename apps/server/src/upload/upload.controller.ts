import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";

@Controller('upload')
export class UploadController {
	constructor (private uploadService: UploadService) {}

	@Post('profilePic')
	@UseInterceptors(FileInterceptor('image'))
	uploadProfilePic(@UploadedFile() image: Express.Multer.File) {
		console.log(image);
		return this.uploadService.uploadProfilePic(image);
	}
}
