import styles from '@/styles/userProfile/profilePic.module.scss';
import { SocketContext } from '@/utils/contexts/SocketContext';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { useUser } from '../../utils/hooks/useUser';

interface Props {
	path?: string;
	size: number;
	stroke: boolean;
	currentUser: string | undefined;
}

export default function ProfilePic({ path, size, stroke, currentUser }: Props) {
	const [isConnected, setIsConnected] = useState('Offline');
	const { user } = useUser();
	const connectedRef = useRef(isConnected);
	const socket = useContext(SocketContext);

	useEffect(() => {
		connectedRef.current = isConnected;
	}, [isConnected]);

	useEffect(() => {
		socket?.socket?.emit('isConnected', currentUser, (status: boolean) => {
			if (connectedRef.current !== 'In Game')
				setIsConnected(status ? 'Online' : 'Offline');
		});

		socket?.socket?.on('isInGame', (username) => {
			if (username === currentUser)
				setIsConnected('In Game');
		});

		socket?.socket?.on('quitInGame', (data) => {
			if (data.username === currentUser)
				setIsConnected(data.status);
		});

		if (currentUser !== user?.name) {
			socket?.socket?.on('mapUpdated', () => {
				socket?.socket?.emit('isConnected', currentUser, (status: boolean) => {
					if (connectedRef.current !== 'In Game')
						setIsConnected(status ? 'Online' : 'Offline');
				});
			});
			return () => {
				socket?.socket?.off('mapUpdated');
			};
		}
	}, [socket, currentUser, user?.name, socket?.socket?.connected]);

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
			src={path ? path : '/default_profil_picture.jpg'}
			width={size}
			height={size}
			priority
		/>
	);
}
