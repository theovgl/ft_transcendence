import { io , Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useUser } from '@/utils/hooks/useUser';
import { stat } from 'fs';
import { set } from 'react-hook-form';
import styles from '@/styles/userProfile/header.module.scss';
import ProfilePic from './UserProfile/ProfilePic';

interface IUserStatus {
	currentUser: string;
}

let socket: Socket = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);

export default function UserStatus({currentUser}: IUserStatus) {
	const [isConnected, setIsConnected] = useState(false);
	const { user } = useUser();

	useEffect(() => {    
		socket.on('mapUpdated', (arg) => {
			socket.emit('isConnected', arg, (status: boolean) => {
				console.log('set updated as: ', status, 'for user: ', arg);
				setIsConnected(status);
			});
		});
		if (currentUser) {
			
			console.log('currentUser: ', currentUser);
			socket.emit('isConnected', currentUser, (status: boolean) => {
				console.log('set connected as: ', status, 'for user: ', currentUser);
				setIsConnected(status);
			});
		}
	}, [socket]);


	useEffect(() => {    
		socket?.connect();
		if (user?.name) {
			// socket = io(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`);
			socket.on('connect', () => {
				console.log(user?.name, 'is connected');
				socket.emit('addConnectedUser', user?.name );
			});
			// socket.on('disconnect', () => {
			// 	console.log(user?.name, 'is disconnected');
			// });
		}
		return () => {
			socket?.disconnect();
		}
	}, [user?.name, currentUser]);
	return (
		<div>
		  <p className={styles.username}>{isConnected ? 'Online' : 'Offline'}</p>
		</div>
	  );
	}