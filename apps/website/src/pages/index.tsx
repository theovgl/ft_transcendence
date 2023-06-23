import 'normalize.css';
import homepageStyle from '@/styles/homepage.module.scss';
import Leaderboard from '@/components/Leaderboard/';
import Navbar from '@/components/Navbar';
import PlayButton from '@/components/PlayButton';
import Head from 'next/head';

export default function Home() {

	return (
		<>
			<Head>
				<title>Transcendence - Home</title>
			</Head>
			<Navbar />
			<div className={homepageStyle.container}>
				<main className={homepageStyle.content}>
					<PlayButton />
					<Leaderboard />
				</main>
			</div>
		</>
	);
}
