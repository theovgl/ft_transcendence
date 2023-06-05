import FormLabel from '@/components/EditProfile/FormLabel';
import LabeledInput from '@/components/EditProfile/LabeledInput';
import Navbar from '@/components/Navbar';
import styles from '@/styles/userProfile/editProfile.module.scss';

export default function editProfile() {
	return (
		<>
			<Navbar />
			<form className={styles.formContainer}>
				<div className={styles.formSection}>
					<FormLabel content='Profile Picture'/>
				</div>
				<div className={styles.formSection}>
					<LabeledInput title='First name' inputPlaceholder='First name'/>
					<LabeledInput title='Last name' inputPlaceholder='Last name'/>
				</div>
				<div className={styles.formSection}>
					<LabeledInput title='Email' inputPlaceholder='email@email.fr'/>
				</div>
			</form>
		</>
	);
}