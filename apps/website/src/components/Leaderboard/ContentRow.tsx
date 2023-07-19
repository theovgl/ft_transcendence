import styles from './Leaderboard.module.scss';

export interface IContentRow {
	username: string;
	winCount: number;
}

export default function ContentRow(option: IContentRow) {
	return (
		<div className={styles.contentRow_container}>
			<p className={styles.contentRow_username}>{option.username}</p>
			<p className={styles.contentRow_winCount}>{option.winCount}</p>
		</div>
	);
}
