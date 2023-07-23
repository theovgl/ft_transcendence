import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState} from 'react';
import {AuthContext} from '@/utils/contexts/AuthContext.tsx';
import styles from '../components/TwoFA/TwoFAForm.module.scss';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import Navbar from '@/components/Navbar';

interface IFormValues {
	'tfaCode': string;
}

export default function CallbackPage() {
	const auth = useContext(AuthContext);
	const router = useRouter();
	const [ twoFA, setTwoFA ] = useState<boolean>(false);
	const cookies = new Cookies();
	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>();
	
	const saveLoginState = () => {
		const jwt = cookies.get('jwt');
		if (!jwt) return;
		const decodedPayload: any = jwtDecode(jwt);

		auth?.login({
			id: decodedPayload.userId,
			name: decodedPayload.username,
			displayName: decodedPayload.displayName,
			email: decodedPayload.email,
			profilePic: decodedPayload.profilePic,
			authToken: decodedPayload.authToken,
			twoFAEnabled: decodedPayload.twoFAEnabled,
		});
	};

	async function getAccessToken(code: string): Promise<boolean> {
		if (code) {
			try {
				const response = await fetch(
					`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/auth/42/callback?code=` + code, {
						method: 'POST',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					}
				);
				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message);
				}
				return true;
			} catch (error: any) {
				console.error(error);
				throw new Error('Failed to get access token: ' + error.message);
			}
		}
		return false;
	}

	const checkTwoFACode = async (twoFAcode: number): Promise<boolean> => {
		try {
			const jwt = cookies.get('jwt');
			const body = { twoFactorAuthenticationCode: twoFAcode };
			const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/auth/2fa/authenticate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + jwt,
				},
				body: JSON.stringify(body)
			});
			if (response.ok) 
				return true;
			else 
				throw new Error(response.statusText);
		} catch (e: any) {
			if (e.message === 'Unauthorized') {
				setError('tfaCode', {
					type: 'server',
					message: 'Invalid code',
				});
				return false;
			} else {
				setError('tfaCode', {
					type: 'server',
					message: 'Something went wrong while checking 2FA',
				});
				return false;
			}
		}
	};

	const onSubmit = async (data: any) => {
		const jwt = cookies.get('jwt');
		if (!jwt) return;
		const decodedPayload: any = jwtDecode(jwt);
		const isSuccess = await checkTwoFACode(data.tfaCode);
		if (isSuccess) {
			auth?.login({
				id: decodedPayload.userId,
				name: decodedPayload.username,
				displayName: decodedPayload.displayName,
				email: decodedPayload.email,
				profilePic: decodedPayload.profilePic,
				authToken: decodedPayload.authToken,
				twoFAEnabled: false,
			});
			router.replace('/');
		}
	};

	useEffect(() => {
		if (!router.isReady) return;

		const code: string = router.query.code as string;
		if (code) {
			getAccessToken(code)
				.then((response) => {
					saveLoginState();
					const jwt = cookies.get('jwt');
					const decodedPayload: any = jwtDecode(jwt);
					if (!decodedPayload.twoFAEnabled) {
						const redirectPath = response === true
							? '/'
							: '/login';
						router.replace(redirectPath);
					}
					setTwoFA(true);
					if (auth?.isAuthenticated) {
						console.log('ah');
						auth.isAuthenticated = false;
					}
				})
				.catch((error) => {
					console.error(error);
					router.replace('/login');
				});
		}
	}, [router]);

	return (
		<div>
			<Navbar />
			{twoFA
				? <form id='2faForm' className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.labeledInput_container}>
						<input
							className={`
						${styles.input}
						${errors.tfaCode ? styles.input_error : ''}
					`}
							type='text'
							placeholder='2FA Code'
							{...register('tfaCode', {
								maxLength: {
									value: 6,
									message: 'Code should be 6 numbers'
								},
								pattern: {
									value: /^[0-9]*$/,
									message: 'Invalid Input. Only use numbers (0-9)'
								}
							})}
						/>
						<span className={
							errors.tfaCode ?
								styles.error_message : styles.error_message_invisible
						}
						>{errors.tfaCode && errors.tfaCode.message}</span>
					</div>
				</form>
				: <p>Checking 2FA...</p>}
		</div>
	);
}