import { headers } from 'next/dist/client/components/headers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CallbackPage() {
	const router = useRouter();
	
	async function getAccessToken(code: string) {
		const response = await fetch(
			'http://localhost:4000/auth/42/callback?code=' + code, {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}
		)
			.then((response) => {
				const cookie = response.headers.get('Authorization');
				console.log(cookie);
			});
		return response;

	}
	
	useEffect(() => {
		const code: string = router.query.code as string;
		if(code) {
			const response = getAccessToken(code);
			const headers = new Headers();
			console.log('headers', headers);
		}
	});
}