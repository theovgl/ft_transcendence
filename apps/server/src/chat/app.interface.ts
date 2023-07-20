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
}

export interface ClientToServerEvents {
	hello: () => void;
	msgToServer: (msg: Message) => void;
	ChangeRoomfromClient: (payload: string) => void;
	UserConnection: (payload: string) => void;
	startDm: (requesterName: string, addresseeName: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}
