import styles from '@/styles/components/PlayButton.module.scss';
import Link from 'next/link';

export default function PlayButton() {
	return (
		<Link className={styles.button} href='/matchmaking'>
            Play !
		</Link>
	);
}