import { io, Socket } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { User, useUser } from './useUser';
import { Cookies } from 'react-cookie';

export const useAuth = () => {
	const { addUser, removeUser, user } = useUser();
	const jwtCookie = new Cookies('jwt');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const socketRef = useRef<Socket | null>(null);

	if (!socketRef.current)
		socketRef.current = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);

	useEffect(() => {
		if (user !== null) {
			setIsAuthenticated(true);
			socketRef.current?.emit('addConnectedUser', user?.name);
			socketRef.current?.connect();
		} else
			setIsAuthenticated(false);
		setIsLoading(false);
	}, [user]);

	const login = (newUser: User) => {
		addUser(newUser);
	};

	const logout = () => {
		if (socketRef.current) {
			socketRef.current.emit('removeConnectedUser', user?.name);
			socketRef.current?.disconnect();
		}
		removeUser();
		jwtCookie.remove('jwt');
	};

	return { login, logout, isLoading, setIsLoading, user, isAuthenticated, socket: socketRef.current };
};
