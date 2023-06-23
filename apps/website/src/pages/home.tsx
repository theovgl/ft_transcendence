import 'normalize.css';
import homepageStyle from '@/styles/homepage.module.scss';
import Leaderboard from '@/components/Leaderboard/';
import Navbar from '@/components/Navbar';
import PlayButton from '@/components/PlayButton';

export default function Home() {

	return (
		<>
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
