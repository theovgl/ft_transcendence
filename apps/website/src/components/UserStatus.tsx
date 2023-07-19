import { useEffect, useState, useRef} from 'react';
import styles from '@/styles/userProfile/header.module.scss';
import { useAuth } from '@/utils/hooks/useAuth';
import { useUser } from './../utils/hooks/useUser';

interface IUserStatus {
	currentUser: string;
}

export default function UserStatus({currentUser}: IUserStatus) {
	const [isConnected, setIsConnected] = useState("Offline");
	const UseAuth = useAuth();
	const { user } = useUser();

	const connectedRef = useRef(isConnected);

	useEffect(() => {
		connectedRef.current = isConnected;
	}, [isConnected]);

	useEffect(() => {
		UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
			if (connectedRef.current !== "In Game")
				setIsConnected(status ? "Online" : "Offline");
		});
		UseAuth.socket?.on('isInGame', (username) => {
			if (username === currentUser)
			{
				setIsConnected("In Game");
			}
		})
		if (currentUser !== user?.name) {
			UseAuth.socket?.on('mapUpdated', () => {
				UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
					if (connectedRef.current !== "In Game")
						setIsConnected(status ? "Online" : "Offline");
				});
				UseAuth.socket?.on('isInGame', (username) => {
					if (username === currentUser)
					{
						setIsConnected("In Game");
					}
				})
				UseAuth.socket?.on('quitInGame', (data) => {
					if (data.username === currentUser)
						setIsConnected(data.status);
				})
			});
			return () => {
				UseAuth.socket?.off('mapUpdated');
			};		
		}		
	}, [UseAuth.socket, currentUser]);
	
	return (
		<div>
			<p className={styles.username}>{isConnected}</p>
		</div>
	);
}