import styles from '@/styles/components/Leaderboard.module.scss';
import ContentRow from './ContentRow';
import { BiMedal } from 'react-icons/bi';

export default function Leaderboard({ data }) {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Leaderboard</p>
			</div>
			<div className={`
				${styles.content}
				${data.length === 0 ? styles.content_empty : ''}
			`}>
				{data.length === 0 ? (
					<>
						<BiMedal />
						<p className={styles.empty_disclaimer}>
							Time to make history!
							Be the first to claim the top spot on the leaderboard.
						</p>
					</>
				) : (
					data.map(row => (
						<ContentRow
							key={row.id}
							username={row.name}
							winCount={row.wins}
						/>
					))
				)}
			</div>
		</div>
	);
}