import 'normalize.css';
import homepageStyle from '@/styles/homepage.module.scss';
import Leaderboard from '@/components/Leaderboard/';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';

export default function Home(props: any) {
	const router = useRouter();

	const onButtonClick = () => {
		router.push({
			pathname: '/game',
			query: {premade: true, premadeId: "20305", premadeMode: "Normal", userId: ""}
		});
	};

	return (
		<>
			<Head>
				<title>Transcendence - Home</title>
			</Head>
			<Navbar />
			<div className={homepageStyle.container}>
				<main className={homepageStyle.content}>
					<Button
						onClick={onButtonClick}
						text='Play !'
						theme='light'
						boxShadow
					/>
					<Leaderboard data={props.data} />
				</main>
			</div>
		</>
	);
}

export async function getServerSideProps() {
	try {
		const res = await fetch('http://backend:4000/leaderboard');
		const data = await res.json();
		
		return { props: { data } };
	} catch (error) {
		console.error('Error fetching leaderboard data: ', error);
		return { props: { data: [] } };
	}
}