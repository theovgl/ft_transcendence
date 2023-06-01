import Head from 'next/head';
import LoginForm from '@/components/Form.tsx';
import 'normalize.css';
import homepageStyle from "@/styles/homepage.module.scss";
import Navigation from "@/components/Navigation.tsx";
import Leaderboard from "@/components/Leaderboard/";
import Button from "@/components/Button/Button";
import Navbar from '@/components/Navbar';
import PlayButton from '@/components/PlayButton';
import { useEffect } from 'react';

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
/* return (
		<>
				<Navigation current_page="HomePage"/>
				<div className={homepageStyle.main}>
					<Button style={homepageStyle.button_play} type="button" label="Play !"/>
					<Leaderboard/>
				</div>
		</>
)*/
}
