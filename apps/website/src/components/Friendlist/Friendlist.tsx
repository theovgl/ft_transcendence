import styles from './Friendlist.module.scss';
import { BiSad } from 'react-icons/bi';

export default function Friendlist() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<p className={styles.title}>Friendlist</p>
			</div>
			<div className={`
				${styles.content}
				${styles.content_empty}
			`}>
				<>
					<BiSad />
					<p className={styles.empty_disclaimer}>
						Oopsie, no friends to be found.
						Let&apos;s spice it up with new friendships!
					</p>
				</>
			</div>
		</div>
	);
}