//import {io, Socket} from "socket.io-client";
//import {ClientToServerEvents} from "../../components/Chat.tsx"
//import {ServerToClientEvents} from "./socket.tsx"
//import { Server } from "socket.io";
//
//export interface InterServerEvents {
//  ping: () => void;
//}
//
//export interface SocketData {
//  name: string;
//  age: number;
//}
//type Message = {
//  author: string;
//  message: string;
//};
//
//export default () => {
//	const io = new Server<
//  ClientToServerEvents,
//  ServerToClientEvents,
//  InterServerEvents,
//  SocketData
//>();
//  const createdMessage = (msg:Message) => {
//    socket.emit("newIncomingMessage", msg);
//  };
//
//  socket.on("createdMessage", createdMessage);
//};
