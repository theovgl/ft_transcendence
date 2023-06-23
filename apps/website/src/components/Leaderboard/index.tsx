import styles from '@/styles/components/Leaderboard.module.scss';
import ContentRow from './ContentRow';
import { useEffect, useState } from 'react';

export default function Leaderboard({ data }) {
	useEffect(() => {
		console.table(data);
	}, [data]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Leaderboard</p>
			</div>
			<div className={styles.content}>
				{/* {data.map(row => {
					return (
						<ContentRow key={row.id}
						username={row.username} winCount={row.wins} />
					);
				})} */}
			</div>
		</div>
	);
}