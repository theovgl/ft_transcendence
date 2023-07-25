import Link from 'next/link';
import ProfilePic from '../UserProfile/ProfilePic';
import styles from './FriendEntity.module.scss';

type Props = {
	name: string;
	profilePicPath: string;
}

export default function FriendEntity({name, profilePicPath}: Props) {
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