import styles from '@/styles/userProfile/profilePic.module.scss';
import Image from 'next/image';

export default function ProfilePic() {
	return (
		<Image
			className={styles.profilePic}
			alt='Profile icture of the user'
			src="/test_image.jpeg"
			width={90}
			height={90}
		/>
	);
}
