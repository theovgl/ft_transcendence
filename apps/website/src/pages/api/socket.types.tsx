
export type Message = {
  author: string;
  message: string;
};

//Server side
export interface ClientToServerEvents {
	createdMessage: (msg: Message) => void;
}

export interface ServerToClientEvents {
	newIncomingMessage: (msg: Message) => void;
	greeting:()=>void;
	message: (msg: Message) => void;
}

//export interface InterServerEvents {
//  ping: () => void;
//}
//
//export interface SocketData {
//  name: string;
//  age: number;
//}
//
////Client side
//export interface ClientToServerEvents {
//  hello: () => void;
//	createdMessage: (msg: Message) => void;
//}
