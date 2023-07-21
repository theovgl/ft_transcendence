import styles from './Message.module.scss';
import ProfilePic from '../UserProfile/ProfilePic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { UserInfos } from 'global';

type MessageProps = {
	content: string;
	username: string;
}

export default function Message({content, username }: MessageProps) {
	const [profilePic, setProfilePic] = useState<string>('');
	const [cookies] = useCookies();

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
			<div className={styles.message_container}>
				<div className={styles.message_username}>
					{username}
				</div>
				<div className={styles.message_content}>
					{content}
				</div>
			</div>
		</div>
	);
}