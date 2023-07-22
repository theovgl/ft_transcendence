import styles from './Message.module.scss';
import ProfilePic from '../UserProfile/ProfilePic';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserInfos } from 'global';
import Button from '@/components/Button/Button';
import { BiLogoKickstarter, BiPlay, BiUserMinus, BiVolumeMute } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/hooks/useUser';
import { Socket } from 'socket.io-client';

type MessageProps = {
	content: string;
	username: string;
	socket: Socket;
	room: string;
	isUserAdmin: boolean
}

export default function Message({content, username, socket, room, isUserAdmin }: MessageProps) {
	const [profilePic, setProfilePic] = useState<string>('');
	const [cookies] = useCookies();
	const router = useRouter();
	const {user} = useUser();
	const [isAdmin, setIsAdmin] = useState<boolean>(isUserAdmin);

	function kick() {
		socket.emit('kick', {kicked: username, room: room});
	}

	function ban() {
		socket.emit('ban', {banned: username, room: room});
	}

	function mute() {
		socket.emit('mute', {muted: username, room: room});
	}

	function sendInvite() {
		const id = [username, user?.name].sort().join('');
		console.log('id', id);
		socket.emit('challenge', {challenged: username});
		router.push(
			{
				pathname: '/game',
				query: { 
					premade: true,
					premadeId: id,
					premadeMode: 'Normal',
					userId: user?.name
				}
			}
		);
	}

	// useEffect(() => {
	// 	const fetchIsAdmin = async () => {
	// 		const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/${room}/isAdmin?username=${user?.name}}`, {
	// 			method: 'GET',
	// 			headers: {
	// 				Content-Type: 'application/json',
	// 				'Authorization': 'Bearer ' + cookies['jwt'],
	// 			}
	// 		});
	// 		const isAdmin = await response.json();
	// 		setIsAdmin(isAdmin);
	// 	};
	// 	fetchIsAdmin();
	// }, [room]);

	useEffect(() => {
		const fetchProfilePic = async () => {
			const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/users/${username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + cookies['jwt'],
				}
			});
			const userInfos: UserInfos = await response.json();
			setProfilePic(userInfos.profilePicPath);
		};
		fetchProfilePic();
	});

	return (
		<div className={styles.message}>
			<div className={styles.message_left}>
				<Link
					href={`/user/${username}`}
					className={styles.message_profilePic}
				>
					<ProfilePic
						path={profilePic}
						size={35}
						stroke={false}
					/>
				</Link>
				<div>
					<div className={styles.message_username}>
						{username}
					</div>
					<div className={styles.message_content}>
						{content}
					</div>
				</div>
			</div>
			<div className={styles.message_right}>
				{username !== user?.name &&
					<Button
						text='Play'
						theme="light"
						boxShadow
						icon={<BiPlay />}
						onClick={sendInvite}
					/>
				}
				{isAdmin && username !== user?.name &&
				<Button
					text='Kick'
					theme="light"
					boxShadow
					icon={<BiLogoKickstarter />}
					onClick={kick}
				/>
				}
				{isAdmin && username !== user?.name &&
				<Button
					text='Ban'
					theme="light"
					boxShadow
					icon={<BiLogoKickstarter />}
					onClick={ban}
				/>
				}
				{isAdmin && username !== user?.name &&
				<Button
					text='mute'
					theme="light"
					boxShadow
					icon={<BiVolumeMute />}
					onClick={mute}
				/>
				}
			</div>
		</div>
	);
}