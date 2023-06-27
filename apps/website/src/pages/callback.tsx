import { useAuth } from '@/utils/hooks/useAuth';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function CallbackPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [ cookies ] = useCookies();
	
	const saveLoginState = () => {
		const jwt = cookies.jwt;
		const jwtPayload: any = jwtDecode(jwt);

		login({
			id: jwtPayload.userId,
			name: jwtPayload.username,
			email: jwtPayload.email,
			authToken: jwt
		});
	};

	async function getAccessToken(code: string): Promise<boolean> {
		try {
			const response = await fetch(
				'http://localhost:4000/auth/42/callback?code=' + code, {
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