import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function CallbackPage() {
	const router = useRouter();
	const [cookie, setCookie] = useCookies(['jwt']);
	
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
				setCookie('jwt', cookie, { path: '/', domain: 'localhost'});
				router.push('http://localhost:3000/home');
			});
		return response;
	}

	useEffect(() => {
		const code: string = router.query.code as string;
		if(code)
			getAccessToken(code);
	});
}