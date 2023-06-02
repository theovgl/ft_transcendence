import styles from '@/styles/userProfile/profilePic.module.scss';
import Image from 'next/image';

interface Props {
	path?: string;
}

export default function ProfilePic({path}: Props) {
	return (
		<Image
			className={styles.profilePic}
			alt='Profile icture of the user'
			src={path ? path : '/test_image.jpeg'}
			width={90}
			height={90}
		/>
	);
}
