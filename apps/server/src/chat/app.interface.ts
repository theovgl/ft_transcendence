export interface Message
{
	author: string;
	message: string;
	channel: string;
}

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	msgToClient: (msg: Message) => void;
	loadDm: (payload: {name: string, dmName: string}) => void;
	loadRoom: (payload: string) => void;
	setAdmin: (status: boolean) => void;
	leaveRoomClient: (roomName: string) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	msgToServer: (msg: Message) => void;
	ChangeRoomfromClient: (payload: string) => void;
	UserConnection: (payload: {username: string, dmReceiverName: string}) => void;
	startDm: (requesterName: string, addresseeName: string) => void;
	checkAdmin: (roomName: string) => void;
	leaveRoom: (payload: {clientName: string, roomName: string}) => void;
	sendDm: (payload: string) => void;
	createRoom: (payload:  {roomName: string, status: string}) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}
