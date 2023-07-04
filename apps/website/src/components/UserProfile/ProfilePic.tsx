import styles from '@/styles/userProfile/profilePic.module.scss';
import Image from 'next/image';

interface Props {
	path?: string;
	size: number;
	stroke: boolean;
}

export default function ProfilePic({path, size, stroke}: Props) {
	return (
		<Image
			className={
				stroke === true ? styles.profilePic_stroke : styles.profilePic
			}
			alt='Profile picture of the user'
			src={path ? path : '/default_profil_picture.jpg'}
			width={size}
			height={size}
		/>
	);
}
