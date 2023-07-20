import Link from 'next/link';
import styles from './FriendEntity.module.scss';
import ProfilePic from '../UserProfile/ProfilePic';
import { useEffect } from 'react';

type Props = {
	name: string;
	profilePicPath: string;
}

export default function FriendEntity({name, profilePicPath}: Props) {
	useEffect(() => {
		console.log('FriendEntity: ', name, profilePicPath);
	});
	return (
		<div className={styles.friendEntity}>
			<Link
				href={`/user/${name}`}
				className={styles.friendEntity_name}
			>
				<ProfilePic
					path={profilePicPath}
					size={35}
					stroke={false}
					currentUser={name}
				/>
				{name}
			</Link>
		</div>
	);
}