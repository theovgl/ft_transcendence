import styles from '@/styles/userProfile/profilePic.module.scss';
import Image from 'next/image';
import { useEffect, useState, useRef} from 'react';
import { useAuth } from '@/utils/hooks/useAuth';
import { useUser } from '../../utils/hooks/useUser';

interface Props {
	path?: string;
	size: number;
	stroke: boolean;
	currentUser: string | undefined;
}

export default function ProfilePic({ path, size, stroke, currentUser }: Props) {
	const [isConnected, setIsConnected] = useState('Offline');
	const UseAuth = useAuth();
	const { user } = useUser();
	const connectedRef = useRef(isConnected);

	useEffect(() => {
		connectedRef.current = isConnected;
	}, [isConnected]);

	useEffect(() => {
		UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
			if (connectedRef.current !== 'In Game')
				setIsConnected(status ? 'Online' : 'Offline');
		});
		UseAuth.socket?.on('isInGame', (username) => {
			if (username === currentUser) 
				setIsConnected('In Game');
			
		});
		if (currentUser !== user?.name) {
			UseAuth.socket?.on('mapUpdated', () => {
				UseAuth.socket?.emit('isConnected', currentUser, (status: boolean) => {
					if (connectedRef.current !== 'In Game')
						setIsConnected(status ? 'Online' : 'Offline');
				});
				UseAuth.socket?.on('isInGame', (username) => {
					if (username === currentUser) 
						setIsConnected('In Game');
					
				});
				UseAuth.socket?.on('quitInGame', (data) => {
					if (data.username === currentUser)
						setIsConnected(data.status);
					console.log('data status:', data.status);
				});
			});
			return () => {
				UseAuth.socket?.off('mapUpdated');
			};		
		}
	}, [UseAuth.socket, currentUser, user?.name, UseAuth.socket?.connected]);

	return (
		<Image
			className={
				`${stroke === true ? styles.profilePic_stroke : styles.profilePic} ${
					isConnected === 'Online'
						? styles.onlineBorder
						: isConnected === 'Offline'
							? styles.offlineBorder
							: isConnected === 'In Game'
								? styles.inGameBorder
								: ''
				}`
			}
			alt='Profile picture of the user'
			src={path ? path : '/images/default_profil_picture.jpg'}
			width={size}
			height={size}
		/>
	);
}
