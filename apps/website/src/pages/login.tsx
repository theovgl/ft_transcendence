import styles from '@/styles/loginPage.module.scss';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

export default function LoginPage() {
	const router = useRouter();
	const [cookies, setCookie] = useCookies(['name']);
	// setCookie('auth', , { path: '/' });
	
	function onSubmit() {
		const ret = router.push('http://localhost:4000/auth/42/login');
		console.log(ret);
	}

	return (
		<>
			<Navbar />
			<div className={styles.container}>
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