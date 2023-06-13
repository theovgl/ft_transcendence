import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CallbackPage() {
	const router = useRouter();
	
	async function getAccessToken(code: string) {
		const response = await fetch('http://localhost:4000/auth/42/testCallback?code=' + code, {
			method: 'POST',
			mode: 'cors',
		});
		console.log(response);
		return response;
	}

	useEffect(() => {
		const code: string = router.query.code as string;
		const response = getAccessToken(code);

		console.log(response);
	});
}