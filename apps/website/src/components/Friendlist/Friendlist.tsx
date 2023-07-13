import { useEffect, useState } from 'react';
import styles from './Friendlist.module.scss';
import { BiSad } from 'react-icons/bi';
import FriendEntity from './FriendEntity';

type FriendEntityType = {
	name: string;
}

export type FriendListType = {
	friendship: FriendEntityType[];
	blocked: FriendEntityType[];
	request: FriendEntityType[];
}

type Props = {
	data: FriendListType | null;
}

export default function Friendlist(props: Props) {
	const {data} = props;
	const [ friends, setFriends ] = useState<FriendEntityType[] | null>(null);
	const [ blocked, setBlocked ] = useState<FriendEntityType[] | null>(null);
	const [ requested, setRequested] = useState<FriendEntityType[] | null>(null);

	useEffect(() => {
		if (!data) return;
		setFriends(data.friendship);
		setBlocked(data.blocked);
		setRequested(data.request);

		console.log(friends, blocked, requested);
	});

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Friendlist</p>
			</div>
			<div className={`
				${styles.content}
				${!data ||
					(!friends && !requested && !blocked) ||
					(friends?.length === 0
						&& blocked?.length === 0
						&& requested?.length === 0) ? styles.content_empty : ''}
			`}>
				{!data ||
					(!friends && !requested && !blocked) ||
					(friends?.length === 0
						&& blocked?.length === 0
						&& requested?.length === 0)
					? (
						<>
							<BiSad />
							<p className={styles.empty_disclaimer}>
						Oopsie, no friends to be found.
						Let&apos;s spice it up with new friendships!
							</p>
						</>
					) : (
						<>
							{requested && requested.length != 0 ? 
								<div className={styles.section_container}>
									<p className={styles.section_title}>Friend request</p>
									{requested.map((request: FriendEntityType) => (
										<FriendEntity
											key={request.name}
											name={request.name}
										/>
									))}
								</div>
								: ''}

							{friends && friends.length != 0 ? 
								<div className={styles.section_container}>
									<p className={styles.section_title}>Friends</p>
									{friends.map((friend: FriendEntityType) => (
										<FriendEntity
											key={friend.name}
											name={friend.name}
										/>
									))}
								</div>
								: ''}

							{blocked && blocked.length != 0 ? 
								<div className={styles.section_container}>
									<p className={styles.section_title}>Blocked users</p>
									{blocked.map((blocked: FriendEntityType) => (
										<FriendEntity
											key={blocked.name}
											name={blocked.name}
										/>
									))}
								</div>
								: ''}
						</>
					)}
			</div>
		</div>
	);
}