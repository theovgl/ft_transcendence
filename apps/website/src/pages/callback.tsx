import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import {useContext, useEffect} from 'react';
import {AuthContext} from '@/utils/contexts/AuthContext.tsx';
import Cookies from 'universal-cookie';

export default function CallbackPage() {
	const auth = useContext(AuthContext);
	const router = useRouter();
	const cookies = new Cookies();
	
	const saveLoginState = () => {
		const jwt = cookies.get('jwt');
		if (!jwt) return;
		const decodedPayload: any = jwtDecode(jwt);

		auth?.login({
			id: decodedPayload.userId,
			name: decodedPayload.username,
			email: decodedPayload.email,
			profilePic: decodedPayload.profilePic,
			authToken: decodedPayload.authToken,
		});
	};

	async function getAccessToken(code: string): Promise<boolean> {
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

	useEffect(() => {
		if (!router.isReady) return;

		const code: string = router.query.code as string;
		if (code) {
			getAccessToken(code)
				.then((response) => {
					saveLoginState();
					const redirectPath = response === true
						? '/'
						: '/login';
					router.replace(redirectPath);
				})
				.catch((error) => {
					console.error(error);
					router.replace('/login');
				});
		}
	}, [router]);
}