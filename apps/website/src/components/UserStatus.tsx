import { useEffect, useState } from 'react';
import styles from '@/styles/userProfile/header.module.scss';
import { useAuth } from '@/utils/hooks/useAuth';
import { useUser } from './../utils/hooks/useUser';

interface IUserStatus {
	currentUser: string;
}

export default function UserStatus({currentUser}: IUserStatus) {
	const [isConnected, setIsConnected] = useState(false);
	const UseAuth = useAuth();
	const { user } = useUser();

	useEffect(() => {
		UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
			setIsConnected(status);
		});	
		if (currentUser !== user?.name) {
			UseAuth.socket?.on('mapUpdated', () => {
				UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
					setIsConnected(status);
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