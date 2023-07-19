import Link from 'next/link';
import styles from './FriendEntity.module.scss';

type Props = {
	name: string;
}

export default function FriendEntity({name}: Props) {
	return (
		<div className={styles.friendEntity}>
			<Link
				href={`/user/${name}`}
				className={styles.friendEntity_name}
			>
				{name}
			</Link>
		</div>
	);
}