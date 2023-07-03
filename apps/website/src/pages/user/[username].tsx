import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import styles from '@/styles/userProfile/userProfile.module.scss';
import { useEffect, useState } from 'react';
import Name from '@/components/UserProfile/Name';
import ProfilePic from '@/components/UserProfile/ProfilePic';
import Button from '@/components/Button/Button';
import { BiBlock, BiCheck, BiMessageAltDetail } from 'react-icons/bi';
import Statistics from '@/components/UserProfile/Statistics';
import Match from '@/components/UserProfile/Match';
import { useCookies } from 'react-cookie';
import type { UserInfos } from 'global';
import jwtDecode from 'jwt-decode';

export default function Profile() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
	const [cookies] = useCookies();

	useEffect(() => {
		if (!router.isReady) return;
		const fetchUserInfo = async () => {
			try {
				await fetch(
					`http://localhost:4000/users/${router.query.username}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + cookies['jwt'],
						},
					})
					.then((response) => {
						if (!response.ok) {
							if (response.status === 404) {
								router.push('/404');
								return null;
							}
							throw new Error('Failed to fetch user info');
						} else
							return response.json();
					})
					.then((response: UserInfos) => {
						setUserInfo(response);
					});
			} catch (error) {
				console.error(error);
			}
		};
		fetchUserInfo();
	}, [router.isReady, router.query.username, router, cookies]);
		
	return (
		<>
			<Navbar />
			<main className={styles.main}>
				{
					userInfo
						? (
							<>
								<div className={styles.header}>
									<div className={styles.user_id_container}>
										<ProfilePic
											path={userInfo.profilePicPath}
										/>
										<Name
											Username={userInfo.name}
											FirstName={userInfo.firstName}
											LastName={userInfo.lastName}
											blockIcon={<BiBlock />}
										/>
									</div>
									<div className={styles.header_buttons_container}>
										<Button
											text='Message'
											theme='light'
											boxShadow
											icon={<BiMessageAltDetail />}
										/>
										<Button
											text='Friend'
											boxShadow={false}
											onClick={ () =>
											{ fetch(
												`http://localhost:4000/friendship/add?requesterName=${encodeURIComponent(
													jwtDecode(cookies['jwt']).username
												  )}&addresseeName=${router.query.username}`, {
													method: 'GET',
													headers: {
														'Content-Type': 'application/json',
														'Authorization': 'Bearer ' + cookies['jwt'],
													},
											})
												.then((response) => {
													if (!response.ok)
														throw new Error('Failed to add friend');
												})
												.catch((error) => {
													console.error(error);
												});
											}}
											theme='dark'
											icon={<BiCheck />}
										/>
									</div>
								</div>
								<div className={styles.content_container}>
									<section className={styles.content_section}>
										<h2 className={styles.title2}>Statistics</h2>
										<Statistics
											level={userInfo.level}
											wins={userInfo.wins}
											losses={userInfo.losses}
											winRate={(5 / 80) * 100}
										/>
									</section>
									<section className={styles.content_section}>
										<h2 className={styles.title2}>Match history</h2>
										<Match
											matchDate={Date.now()}
											player1Name='tvogel'
											player1Score={8}
											player2Name='ppiques'
											player2Score={4}
											matchDuration='18:20'
										/>
										<Match
											matchDate={Date.now()}
											player1Name='tvogel'
											player1Score={8}
											player2Name='ppiques'
											player2Score={4}
											matchDuration='18:20'
										/>
									</section>
								</div>
							</>
						)
						: ( <p>Loading...</p> )
				}
			</main>
		</>
	);
}
