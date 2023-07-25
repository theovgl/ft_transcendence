import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ImSpinner5 } from 'react-icons/im';
import Navbar from './Navbar';

export default function LoadingPage() {
	const router = useRouter();

	useEffect(() => {
		const redirectTimer = setTimeout(() => {
			router.push('/login');
		}, 75);

		return () => clearTimeout(redirectTimer); // Clear the timer if the component unmounts
	}, [router]);

	return (
		<>
			<Navbar />
			<div className='flex flex-col items-center justify-center min-h-screen text-gray-800'>
				<ImSpinner5 className='mb-4 text-6xl animate-spin' />
				<p>Loading...</p>
			</div>
		</>
	);
}