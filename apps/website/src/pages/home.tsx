import 'normalize.css';
import homepageStyle from '@/styles/homepage.module.scss';
import Leaderboard from '@/components/Leaderboard/';
import Navbar from '@/components/Navbar';
import PlayButton from '@/components/PlayButton';

export default function Home() {

	return (
		<div className={homepageStyle.container}>
			<Navbar />
			<main className={homepageStyle.content}>
				<PlayButton />
				<Leaderboard />
			</main>
		</div>
	);
}
