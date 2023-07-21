import React from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socketRef: Socket;
};

export const SocketContext = React.createContext<SocketContextType | null>(null!);

export const SocketProvider = ({children}): 
