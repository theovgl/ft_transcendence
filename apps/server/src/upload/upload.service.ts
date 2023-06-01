import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UploadService {
	constructor(private prisma: PrismaService) {}

	async uploadProfilePic(image: Express.Multer.File) {

	};
}
