import Button from '@/components/Button/Button';
import Friendlist, { FriendListType } from '@/components/Friendlist/Friendlist';
import Leaderboard from '@/components/Leaderboard/index';
import Navbar from '@/components/Navbar';
import homepageStyle from '@/styles/homepage.module.scss';
import { SocketContext } from '@/utils/contexts/SocketContext';
import { useUser } from '@/utils/hooks/useUser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import 'normalize.css';
import { useContext, useEffect, useState } from 'react';

export default function Home(props: any) {
	const router = useRouter();
	const {user} = useUser();
	const [friendListData, setFriendListData] = useState<FriendListType | null>(null);
	const socketContext = useContext(SocketContext);
	const socket = socketContext?.socket;

	const onButtonClick = () => {
		router.push({
			pathname: '/game',
			query: {premade: false, premadeId: '', premadeMode: 'Normal', userId: user?.name }
		});
	};

	useEffect(() => {
		if (!user) return;

		const fetchRelationList = async () => {
			try {
				await fetch(
					`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/friendship/getRelationshipList?requesterName=${user?.name}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					})
					.then(async (response) => {
						const data: FriendListType = await response.json();
						return data;
					})
					.then((data: FriendListType) => {
						setFriendListData(data);
					});
			} catch (error) {
				console.error('Error while fetching user friendlist: ', error);
			}
		};

		fetchRelationList();
	}, [user]);

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
					<div className={homepageStyle.info_container}>
						<Leaderboard data={props.data} />
						<Friendlist data={friendListData} />
					</div>
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