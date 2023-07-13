import { io , Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useUser } from '@/utils/hooks/useUser';
import { stat } from 'fs';
import { set } from 'react-hook-form';

let socket: Socket = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);

export default function UserStatus() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const { user } = useUser();
	console.log('isConnected: ', isConnected, 'user: ', user?.name);

	useEffect(() => {
		const currentUser = user?.name;	
		if (currentUser) {
			socket = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);
			socket.on('connect', () => {
				setIsConnected(true);
				socket.emit('userConnected', {name: currentUser});
			});
			socket.emit('isConnected', socket.id, (status: boolean) => {
				setIsConnected(status);
			});
		}
	} ,[user?.name]);
	console.log('isConnected: ', isConnected, 'user: ', user?.name);
	return (
		<div>
		  <p>User status: {isConnected ? 'Online' : 'Offline'}</p>
		</div>
	  );
	}