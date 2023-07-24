import React, { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

type SocketContextType = {
	socket: Socket | null;
};

export const SocketContext = React.createContext<SocketContextType | null>(null!);

export const SocketProvider = (props: React.PropsWithChildren) => {
	const { isAuthenticated, user } = useAuth();
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const { children } = props;

	const socket = useRef<Socket | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			socket.current = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);
			socket.current.on('connect', () => {
				console.info('Socket connected');
				socket.current?.emit('addConnectedUser', user?.name);
				setIsSocketConnected(true);
			});

			socket.current?.on('disconnect', () => {
				console.info('Socket disconnected');
				socket.current?.emit('removeConnectedUser', user?.name);
				socket.current?.disconnect();
				setIsSocketConnected(false);
			});

			socket.current?.on('error', (err: any) => {
				console.log('Socket Error:', err.message);
			});
		}
	}, [isAuthenticated]);

	return (
		<SocketContext.Provider value={{ socket: socket.current }}>
			{children}
		</SocketContext.Provider>
	);
};
