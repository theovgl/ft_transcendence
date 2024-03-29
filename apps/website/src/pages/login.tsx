import styles from '@/styles/loginPage.module.scss';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';

export default function LoginPage() {
	const router = useRouter();

	function onSubmit() {
		router.push(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/auth/42/login`);
	}

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<h1 className={styles.welcomeTitle}>Welcome !</h1>
				<Button
					text='Login with 42'
					theme='light'
					boxShadow
					type='button'
					onClick={onSubmit}
				/>
			</div>
		</>
	);
}