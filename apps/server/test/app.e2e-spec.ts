import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { EditUserDto } from 'src/user/dto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);
		await app.init();
		await app.listen(4000);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();
		pactum.request.setBaseUrl('http://localhost:4000');
	});

	afterAll(() => {
		app.close();
	});

	const dto: AuthDto = {
		email: 'test@gmail.com',
		password: '123',
	};
	describe('Auth', () => {
		describe('Signup', () => {
			it('email empty', () => {
				return pactum.spec()
					.post('/auth/signup')
					.withBody({
						password: dto.password
					})
					.expectStatus(400);
			});
			it('password empty', () => {
				return pactum.spec()
					.post('/auth/signup')
					.withBody({
						email: dto.email
					})
					.expectStatus(400);
			});
			it('body empty', () => {
				return pactum.spec()
					.post('/auth/signup')
					.expectStatus(400);
			});
			it('should signup', () => {
				return pactum.spec()
					.post('/auth/signup')
					.withBody(dto)
					.expectStatus(201);
			});
		});
		describe('Signin', () => {
			it('email empty', () => {
				return pactum.spec()
					.post('/auth/signin')
					.withBody({
						password: dto.password
					})
					.expectStatus(400);
			});
			it('password empty', () => {
				return pactum.spec()
					.post('/auth/signin')
					.withBody({
						email: dto.email
					})
					.expectStatus(400);
			});
			it('body empty', () => {
				return pactum.spec()
					.post('/auth/signin')
					.expectStatus(400);
			});
			it('should signin', () => {
				return pactum.spec()
					.post('/auth/signin')
					.withBody(dto)
					.stores('userAt', 'access_token');
			});
		});
	});

	describe('User', () => {
		describe('Get User', () => {
			it('should get current user', () => {
				return pactum.spec()
					.get('/users/me')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}'
					})
					.expectStatus(200);
			});
		});
		describe('Edit User', () => {
			it('should edit user', () => {
				const dto: EditUserDto = {
					firstName: 'Vladimir',
					email: 'vlad@codewithvlad.com',
				};
				return pactum
					.spec()
					.patch('/users')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.email);
			});
		});
	});

	describe('Bookmarks', () => {
		describe('Get empty Bookmarks', () => {
			it('should get bookmarks', () =>{
				return pactum
					.spec()
					.get('/bookmarks')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
					.expectBody([]);
			});
		});
		describe('Create Bookmark', () => {
			const dto: CreateBookmarkDto = {
				title: 'MAZL',
				link: 'aye'
			};
			it('should create bookmark', () =>{
				return pactum
					.spec()
					.post('/bookmarks')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(201)
					.stores('bookmarkId', 'id');
			});
		});
		describe('Get Bookmark', () => {
			it('should get bookmarks', () =>{
				return pactum
					.spec()
					.get('/bookmarks')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
					.expectJsonLength(1);
			});
		});
		describe('Get Bookmark by id', () => {
			it('should get bookmark by id', () =>{
				return pactum
					.spec()
					.get('/bookmarks/{id}')
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
					.expectBodyContains('$S{bookmarkId}');
			});
		});
		describe('Edit Bookmark by id', () => {
			const dto: EditBookmarkDto = {
				title: 'NEW TITLE',
				description: 'hello',
				link: 'AOAOZOAO'
			};
			it('should edit bookmark by id', () =>{
				return pactum
					.spec()
					.patch('/bookmarks/{id}')
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.title)
					.expectBodyContains(dto.description);
			});
		});
		describe('Delete Bookmark by id', () => {
			it('should delete bookmark by id', () =>{
				return pactum
					.spec()
					.delete('/bookmarks/{id}')
					.withPathParams('id', '$S{bookmarkId}')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(204);
			});

			it('should get empty bookmark by id', () =>{
				return pactum
					.spec()
					.get('/bookmarks')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200)
					.expectJsonLength(0);
			});
		});
	});

});