import { use, useEffect, useState } from 'react';
import styles from '@/styles/userProfile/header.module.scss';
import { useAuth } from '@/utils/hooks/useAuth';
import { set } from 'react-hook-form';
import { User, useUser } from './../utils/hooks/useUser';

interface IUserStatus {
	currentUser: string;
}

export default function UserStatus({currentUser}: IUserStatus) {
	const [isConnected, setIsConnected] = useState(false);
	const UseAuth = useAuth();
	const { addUser, removeUser, user } = useUser();

	useEffect(() => {
		UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
			setIsConnected(status);
        });
		if (currentUser !== user?.name) {
			UseAuth.socket?.on('mapUpdated', (arg) => {
				console.log('currentUser: ', currentUser, 'arg: ', arg);
				UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
					console.log('set updated as: ', status, 'for user: ', arg);
					setIsConnected(status);
				// if (!UseAuth.isAuthenticated)
				// 	setIsConnected(false);
				});
		});
		return () => {
			UseAuth.socket?.off('mapUpdated');
		};		
	}		
	}, [UseAuth.socket, currentUser]);
	
	return (
		<div>
		  <p className={styles.username}>{isConnected ? 'Online' : 'Offline'}</p>
		</div>
	  );
	}