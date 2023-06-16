import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CallbackPage() {
	const router = useRouter();
	
	async function getAccessToken(code: string) {
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

			const data = await response.text();
			return data
				? JSON.parse(data)
				: {};
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