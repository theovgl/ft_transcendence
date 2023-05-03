//import messageHandler from "./messageHandler.tsx";
import { Server } from "socket.io";
import {ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, Message} from "./socket.types.tsx"

export default function SocketHandler(req: Server, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

	const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
	>();
  res.socket.server.io = io;

  const onConnection = (socket: any) => {
  //  messageHandler(io, socket);
	//let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  const createdMessage = (msg:Message) => {
    socket.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
