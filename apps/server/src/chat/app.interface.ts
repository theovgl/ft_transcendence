export interface ChatInterface
{
	type Message = {
		author: string;
		message: string;
		channel: string;
	}
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
	msgToClient: (msg: Message) => void;
}

interface ClientToServerEvents {
  hello: () => void;
	msgToServer: (msg: Message) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
