import styles from '@/styles/userProfile/profilePic.module.scss';
import Image from 'next/image';

interface Props {
	path?: string;
}

export default function ProfilePic({path}: Props) {
	return (
		<Image
			className={styles.profilePic}
			alt='Profile picture of the user'
			src={path ? path : '/default_profil_picture.jpg'}
			width={90}
			height={90}
		/>
	);
}
