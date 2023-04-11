import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class BookmarkService {
    private prisma;
    constructor(prisma: PrismaService);
    getBookmarks(userId: number): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Bookmark[]>;
    getBookmarkById(userId: number, bookmarkId: number): import(".prisma/client").Prisma.Prisma__BookmarkClient<import(".prisma/client").Bookmark, never>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    deleteBookmarkById(userId: number, bookmarkId: number): Promise<import(".prisma/client").Bookmark>;
}
