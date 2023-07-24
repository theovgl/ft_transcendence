import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Match.module.scss';

interface Props {
	matchDate: number,
	player1Score: number;
	player1Name: string;
	player2Score: number;
	player2Name: string;
	matchDuration: string;
}

export default function Match({
	matchDate,
	player1Score,
	player1Name,
	player2Score,
	player2Name,
	matchDuration,
}: Props) {

	const [winner, setWinner] = useState(1);

	useEffect(() => {
		if (player1Score > player2Score)
			setWinner(1);
		else
			setWinner(2);
	});

	return (
		<div className={styles.match_card}>
			<div className={styles.score_container}>
				<Link
					className={
						`
						${winner === 1 ? styles.winner : null}
						${styles.player_name}
					`
					}
					href={`/user/${player1Name}`}
				>
					{ player1Name }
				</Link>

				<p className={
					`
						${winner === 1 ? styles.winner : null}
						${styles.player_score}
					`
				}>{ player1Score }</p>

				<p className={styles.score_separator}>vs</p>

				<p className={
					`
					${winner === 2 ? styles.winner : null}
					${styles.player_score}
				`
				}>{ player2Score }</p>

				<Link
					className={
						`
						${winner === 2 ? styles.winner : null}
						${styles.player_name}
					`
					}
					href={`/user/${player2Name}`}
				>
					{ player2Name }
				</Link>
			</div>
			<p className={styles.match_duration}>{ matchDuration }</p>
		</div>
	);
}