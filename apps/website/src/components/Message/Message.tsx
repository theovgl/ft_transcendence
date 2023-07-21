import styles from './Message.module.scss';
import ProfilePic from '../UserProfile/ProfilePic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserInfos } from 'global';
import Button from '@/components/Button/Button';
import { BiPlay } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/hooks/useUser';
import { Socket } from 'socket.io-client';

type MessageProps = {
	content: string;
	username: string;
	socket: Socket;
}

export default function Message({content, username, socket }: MessageProps) {
	const [profilePic, setProfilePic] = useState<string>('');
	const [cookies] = useCookies();
	const router = useRouter();
	const {user} = useUser();

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
			<Link
				href={`/user/${username}`}
				className={styles.message_profilePic}
			>
				<ProfilePic
					currentUser={username}
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
			<div className={styles.message_container}>
				{/* {username !== user?.name && */}
					<Button
						text='Play'
						theme="light"
						boxShadow
						icon={<BiPlay />}
						onClick={sendInvite}
					/>
				{/* } */}
			</div>
		</div>
	);
}