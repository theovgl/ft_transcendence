import EditUserForm from '@/components/EditProfile/EditUserForm';
import Navbar from '@/components/Navbar';
import styles from '@/styles/userProfile/editProfile.module.scss';

export default function editProfile() {
	return (
		<>
			<Navbar />
			<main className={styles.content_container}>
				<EditUserForm />
			</main>
		</>
	);
}