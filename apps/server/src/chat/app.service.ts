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
   
	public async createRoom(room: string, owner: string, status: string, password ?: string)
	{
		if (await this.prisma.room.findUnique({
			where: {
				name: room,
			}
		}))
			return;
		const user = await this.findUser(owner);
		if (user){
			await this.prisma.room.create({
				data: {
					name: room,
					status: status,
					password: password,
				},
			})
			if (status === "public"){
				this.addAllUsersToRoom(room);
			}
			else{
				await this.addUserToRoom(owner, room);
			}
			await this.setUserAsOwner(owner, room);
		}
	}

	async addAllUsersToRoom(roomName: string){
		const users = await this.prisma.user.findMany();

		if (users){
			users.forEach((user) =>{
				this.addUserToRoom(user.name, roomName)
			})
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

	async setPassword(roomName: string, password ?: string){
		const room = await this.findRoom(roomName);

		if (room){
			await this.prisma.room.update({
				where: {
					id: room.id
				},
				data: {
					password: password
				}
			})
		}
	}

	async	setUserAsAdmin(admin: string, roomName: string){
		console.log("set admin: " + admin);
		const room = await this.findRoom(roomName);
		const user = await this.findUser(admin);
		if (user && room)
		{
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

	public async loadRoom(client: Socket, room: string, password ?: string)
	{
		if (password && !this.checkPassword(password, room)){
			console.log("bad password");
			return;
		}
		await this.checkAdmin(client, room);
		if (room !== this.currentRoomName)
		{
			console.log("client leaving : " + this.currentRoomName);
			console.log("client joining : " + room);
		}
		const bannedUser = await this.findBannedTalk(this.clientList.get(client), room)
		//emit un message pour dire au user qu'il est ban ?
		if (bannedUser)
			return;
		await this.addUserToRoom(this.clientList.get(client), room)
		client.leave(this.currentRoomName);
		client.join(room);
		this.currentRoomName = room;
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
		// this.createRoom(room, this.clientList.get(client));
		await this.loadRoom(client, room);
	}

	async loadRoomlist(client: Socket): Promise<string | 'General'>
	{
		const rooms = await this.addUsertoAllPublicRooms(this.clientList.get(client));
		const user = await this.findUser(this.clientList.get(client));
		let	  counter = 0;
		let	  firstRoomName;
		if (user && rooms)
		{
			const talks = await this.prisma.talk.findMany({
				where: {
					userId: user.id,
				},
				include: {
					room: true,
				},
			})
			if (talks && talks.length > 0){
				talks.forEach((talk) => {
					if (counter === 0)
						firstRoomName = talk.room.name;
					client.emit('loadRoom', talk.room.name);
					counter++;
				});
				return firstRoomName;
			}
			return 'General'
		}
		return 'General'
	}

	async addUsertoAllPublicRooms(clientName: string): Promise<Room[] | null>{
		const rooms = await this.prisma.room.findMany({
			where: {
				status: "public",
			}
		})
		if (rooms){
			rooms.forEach((room) => {
				this.addUserToRoom(clientName, room.name);
			})
			return rooms;
		}
		return null
	}
 
	public async userConnection(client: Socket, room: string, payload: string, dmReceiverName: string)
	{
		let firstRoomName;
		this.clientList.set(client, payload);
		await this.createRoom(room, this.clientList.get(client), "public"); 
		firstRoomName = await this.loadRoomlist(client)
		await this.loadRoom(client, firstRoomName);
		if (dmReceiverName !== "")
			await this.createDm(client, payload, dmReceiverName)
	}

	public async userDisconnection(client: Socket)
	{
		this.clientList.delete(client)
	}

	async storeMessage(payload) {
		console.log("channel name : " + payload.channel);
		console.log("author name: " + payload.author);
		
		const mutedUser = await this.findMutedTalk(payload.author, payload.channel)
		//emit un message pour dire au user qu'il est mute ?
		if (mutedUser)
		{
			console.log('muted user: ' + payload.author + ' tried to talk in: ' + payload.channel) 
			return false;
		}
		const author = await this.findUser(payload.author);

		const room = await this.findRoom(payload.channel);
 
		if (!author || !room)
		{
			console.log("author or room not found");
			return false;
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
			return true;
		}
	}

	public async createDm(client: Socket, clientName: string, receiverName: string)
	{
		const username = this.clientList.get(client);
		const roomName = [username, receiverName].sort().join('');
		console.log('createDm: ' + receiverName + username);
		await this.createRoom(roomName, username, "private");
		await this.removeOwner(username, roomName);
		await this.addUserToRoom(username, roomName);
		await this.addUserToRoom(receiverName, roomName);
		await this.loadRoom(client, roomName);
		client.emit('loadDm', {name: username, dmName: roomName});
	}

	public async createGameInvite(client: Socket, payload)
	{
		const username = this.clientList.get(client);
		const roomName = [username, payload].sort().join('');
		await this.createRoom(roomName, username, "private");
		await this.removeOwner(username, roomName)
		await this.addUserToRoom(this.clientList.get(client), roomName);
		await this.addUserToRoom(payload, roomName);
		await this.storeMessage({author: username, channel: roomName, message: "Clique sur play pour jouer avec moi !"});
		await this.loadRoom(client, roomName)
	}
  
	public async checkAdmin(client: Socket, roomName: string) {
		const userName = this.clientList.get(client);
		const adminTalk = await this.findAdminTalk(userName, roomName)
		if (adminTalk){
			console.log('setAdmin for: ' + roomName);
			client.emit('setAdmin', true);
		}
		else {
			console.log('unsetAdmin for: ' + roomName);
			client.emit('setAdmin', false);
		}
	}

	public async checkPassword(password: string, roomName: string) {
		const room = await this.findRoom(roomName);

		if (room){
			if (room.password === null)
				return true;
			else {
				return password === room.password
			}
		}
	}

	public async leaveRoom(clientName: string, roomName: string){
		await this.removeTalk(clientName, roomName, this.prisma.talk);				
		for (const [client, userId] of this.clientList) {
			if (userId === clientName)
			{
				client.emit('leaveRoomClient', roomName);
			}
		}
	}

	async	kickUser(userName:string, roomName: string){
		console.log("kick: " + userName + " from: " + roomName);
		this.leaveRoom(userName, roomName);
	}

	async	banUser(userName: string, roomName: string){
		this.kickUser(userName, roomName);
		this.addTalk(userName, roomName, this.prisma.bannedTalk)
	}

	async 	muteUser(userName: string, roomName: string){
		const mutedUser = await this.findMutedTalk(userName, roomName);
		if (mutedUser)
		{
			console.log("already muted");
			return;
		}
		console.log('mute user: ' + userName + "in room: " + roomName);
		this.addTalk(userName, roomName, this.prisma.mutedTalk)
		setTimeout(() => {
			console.log('unmute user: ' + userName + "in room: " + roomName);
			this.removeTalk(userName, roomName, this.prisma.mutedTalk)			
		}, 600 * 10);
	}
  
	async	addUserToRoom(clientName: string, roomName: string) {
		const bannedUser = await this.findBannedTalk(clientName, roomName)
		//emit un message pour dire au user qu'il est ban ?
		if (bannedUser)
			return;
		const talk = await this.findTalk(clientName, roomName);
		if (talk)
			return;
		await this.addTalk(clientName, roomName, this.prisma.talk)
		for (const [client, userId] of this.clientList) {
			if (userId === clientName)
			{
				client.emit('loadRoom', roomName);
			}
		}
	}

	async addTalk(clientName: string, roomName: string, talk: any){
		const user = await this.findUser(clientName);
		const room = await this.findRoom(roomName);
		
		if (user && room)
		{
			if (
				await talk.findUnique({
					where: {
						userId_roomId: {
							userId: user.id,
							roomId: room.id,
					},
				}
			}))
				return ;
			await talk.create({
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
			await this.removeTalk(clientName, roomName, this.prisma.adminTalk)
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

	async removeTalk(clientName: string, roomName: string, talk: any) {
		const user = await this.findUser(clientName);
		const room = await this.findRoom(roomName);
	  
		if (user && room) {
		  const talks = await talk.findMany({
			where: {
			  userId: user.id,
			  roomId: room.id,
			},
		  });
	  
		  if (talks.length > 0) {
			await talk.deleteMany({
				where: {
					userId: user.id,
					roomId: room.id,
				}
			})
		  }
		}
	  }
	  


	async findUser(userName?: string): Promise<User | null>
	{
		if (!userName || typeof userName === 'undefined')
			return null;
		return (await this.prisma.user.findUnique({
			where: {
				name: userName,
			}
		}))
	}

	async	findRoom(roomName?: string): Promise<Room | null>
	{
		if (!roomName || typeof roomName === 'undefined')
			return null;	
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
		return null;
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
