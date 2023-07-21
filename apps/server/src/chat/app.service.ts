import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService, User, Room } from '../prisma/prisma.service';
import { MessageDto } from './dto';
import { Socket } from 'socket.io';
import { Message } from './app.interface';
import { AdminTalk, BannedTalk, MutedTalk, Talk } from '@prisma/client';

@Injectable()
export class ChatService implements OnModuleInit {
	constructor(private prisma: PrismaService) {}

	private clientList: Map<Socket, string> = new Map<Socket, string>()
	private currentRoomName = "";
	
	async onModuleInit()
	{
	}

	public async createRoom(room: string, owner: string)
	{
		if (await this.prisma.room.findUnique({
			where: {
				name: room,
			}
		}))
			return;
		console.log(owner);
		const user = await this.findUser(owner);
		if (user){
			await this.prisma.room.create({
				data: {
					name: room,
					owner: {
						connect: { id: user.id },
					},
				},
			})
			await this.setUserAsOwner(owner, room);
		}
	}

	async setUserAsOwner(owner: string, roomName: string){
		const user = await this.findUser(owner);
	
		const room = await this.findRoom(roomName)
		if (room && user) {
			await this.prisma.room.update({
				where: {
					id: room.id
				},
				data: {
					owner:{
						connect: { 
							id: user.id 
						}
					}
				}
			})
		}
		await this.setUserAsAdmin(owner, roomName);
	}

	async	setUserAsAdmin(admin: string, roomName: string){
		console.log("set admin: " + admin);
		const room = await this.findRoom(roomName);
		const user = await this.findUser(admin);
		if (user && room)
		{
			console.log("in admin: " + admin);
			if (await this.prisma.adminTalk.findUnique({
				where : {
					userId_roomId: {
						userId: user.id,
						roomId: room.id
					}
				}
			}))
				return;
			await this.prisma.adminTalk.create({
				data: {
					userId: user.id,
					roomId: room.id
				}
			})
		}
	}

	public async loadRoom(client: Socket, room: string)
	{
		if (room !== this.currentRoomName)
		{
			console.log("client leaving : " + this.currentRoomName);
			console.log("client joining : " + room);
		}
		this.addUserToRoom(this.clientList.get(client), room)
		client.leave(this.currentRoomName);
		client.join(room);
		this.currentRoomName = room;
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
	}

	public async changeRoom(client: Socket, room: string)
	{
		this.createRoom(room, this.clientList.get(client));
		this.loadRoom(client, room);
	}

	async loadRoomlist(client: Socket)
	{
		const user = await this.findUser(this.clientList.get(client));
		if (user)
		{
			const talks = await this.prisma.talk.findMany({
				where: {
					userId: user.id,
				},
				include: {
					room: true,
				},
			})
			talks.forEach((talk) => {
				console.log('add Room: ' + talk.room.name + ' to user: ' + user.name);
				client.emit('loadRoom', talk.room.name);
			});
		}
	}

	public async userConnection(client: Socket, room: string, payload: string)
	{
		this.clientList.set(client, payload);
		await this.createRoom(room, this.clientList.get(client)); 
		await this.addUserToRoom(this.clientList.get(client), room);
		await this.loadRoomlist(client)
		await this.loadRoom(client, room);
		await this.checkAdmin(client, room);
	}

	public async userDisconnection(client: Socket)
	{
		this.clientList.delete(client)
	}

	async storeMessage(payload) {
		console.log("channel name : " + payload.channel);
		console.log("author name: " + payload.author);
		
		const author = await this.findUser(payload.author);

		const room = await this.findRoom(payload.channel);

		if (!author || !room)
		{
			console.log("author or room not found");
		}
		else {
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
		}
	}

	public async createDm(client: Socket, payload)
	{
		const username = this.clientList.get(client);
		const roomName = [username, payload].sort().join('');
		await this.createRoom(roomName, username);
		await this.removeOwner(username, roomName)
		await this.addUserToRoom(this.clientList.get(client), roomName);
		await this.addUserToRoom(payload, roomName);
		await this.loadRoom(client, roomName)
	}

	public async createGameInvite(client: Socket, payload)
	{
		const username = this.clientList.get(client);
		const roomName = [username, payload].sort().join('');
		await this.createRoom(roomName, username);
		await this.removeOwner(username, roomName)
		await this.addUserToRoom(this.clientList.get(client), roomName);
		await this.addUserToRoom(payload, roomName);
		await this.storeMessage({author: username, channel: roomName, message: "Clique sur play pour jouer avec moi !"});
		await this.loadRoom(client, roomName)
	}
  
	public async checkAdmin(client: Socket, roomName: string) {
		console.log("check Admin: " + roomName);
		const userName = this.clientList.get(client);
		const adminTalk = await this.findAdminTalk(userName, roomName)
		if (adminTalk){
			console.log('setAdmin for: ' + roomName);
			client.emit('setAdmin', true);
		}
		else{
			client.emit('setAdmin', false);
		}
	}

	public async leaveRoom(clientName: string, roomName: string){
		await this.removeTalk(clientName, roomName);				
		for (const [client, userId] of this.clientList) {
			if (userId === clientName)
			{
				client.emit('leaveRoom', roomName);
			}
		}
	}

	async addUserToRoom(clientName: string, roomName: string) {
		await this.addTalk(clientName, roomName)
		for (const [client, userId] of this.clientList) {
			if (userId === clientName)
			{
				client.emit('loadRoom', roomName);
			}
		}
	}

	async addTalk(clientName: string, roomName: string){
		const user = await this.findUser(clientName);
		const room = await this.findRoom(roomName);
		
		if (user && room)
		{
			if (
				await this.prisma.talk.findUnique({
					where: {
						userId_roomId: {
							userId: user.id,
						roomId: room.id,
					},
				}
			}))
				return ;
			await this.prisma.talk.create({
				data: {
					userId: user.id,
					roomId: room.id
				}
			})
		}
	}

	async removeOwner(clientName: string, roomName: string) {
		const user = await this.findUser(clientName);
		const room = await this.findRoom(roomName);
		
		if (user && room){
			await this.removeAdminTalk(clientName, roomName);
			await this.prisma.user.update({
				where: { id: user.id },
				data: {
					roomsOwned: {
					disconnect: {
						id: room.id,
					},
					},
				},
			});
		}
	}

	async removeTalk(clientName: string, roomName: string) {
		const user = await this.findUser(clientName);
		const room = await this.findRoom(roomName);

		if (user && room){
			await this.prisma.talk.delete({
					where: {
						userId_roomId: {
							userId: user.id,
							roomId: room.id
						}
				}
			})
		}
	}

	async removeAdminTalk(clientName: string, roomName: string) {
		const adminTalk = await this.findAdminTalk(clientName, roomName)

		if (adminTalk){
			await this.prisma.adminTalk.delete({
					where: {
						userId_roomId: {
							userId: adminTalk.userId,
							roomId: adminTalk.roomId
						}
				}
			})
		}
	}

	async findUser(userName: string): Promise<User | null>
	{
		return (await this.prisma.user.findUnique({
			where: {
				name: userName,
			}
		}))
	}

	async	findRoom(roomName: string): Promise<Room | null>
	{
		return ( await this.prisma.room.findUnique({
			where: {
				name: roomName,
			}
		}))
	}

	async findTalk(userName: string, roomName: string): Promise<Talk | null>
	{
		const user = await this.findUser(userName);
		const room = await this.findRoom(roomName);
		
		if (user && room){
			return ( await this.prisma.talk.findUnique({
				where: {
					userId_roomId : {
						userId: user.id,
						roomId: room.id
					}
				}
			}))
		}
	}

	async findAdminTalk(userName: string, roomName: string): Promise<AdminTalk | null>
	{
		const user = await this.findUser(userName);
		const room = await this.findRoom(roomName);
		
		if (user && room){
			return ( await this.prisma.adminTalk.findUnique({
				where: {
					userId_roomId : {
						userId: user.id,
						roomId: room.id
					}
				}
			}))
		}
	}

	async findMutedTalk(userName: string, roomName: string): Promise<MutedTalk | null>
	{
		const user = await this.findUser(userName);
		const room = await this.findRoom(roomName);
		
		if (user && room){
			return ( await this.prisma.mutedTalk.findUnique({
				where: {
					userId_roomId : {
						userId: user.id,
						roomId: room.id
					}
				}
			}))
		}
	}

	async findBannedTalk(userName: string, roomName: string): Promise<BannedTalk | null>
	{
		const user = await this.findUser(userName);
		const room = await this.findRoom(roomName);
		
		if (user && room){
			return ( await this.prisma.bannedTalk.findUnique({
				where: {
					userId_roomId : {
						userId: user.id,
						roomId: room.id
					}
				}
			}))
		}
	}

// OPTIONAL
// if no user delete the room (in app.gateway)
// 	deleteRoom(roomName)
// find room
// delete room

//add room status in Room model in prisma schema
//add behaviours depending on status in loadRoom

//add password in Room model
//add pssword behaviour in loadRoom

//Checkpassword(payload)
//Modifypassword(payload)
//Deletepassword(payload)

//blocked messages behaviour will be on front end

//if owner quits, the next admin become owner
//if no other admin, make the next user is owner and admin

//Kick
//Use the leaveRoom function

//Ban
//Same as Kick + ajouter au tableau Banned users
//add a check in loadRoom to prevent bannedusers to join

//Mute
//Prevent muted users to storeMessage

  getHello(): string {
    return 'Hello World!';
  }
}
