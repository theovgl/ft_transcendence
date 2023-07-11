import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import styles from '@/styles/userProfile/userProfile.module.scss';
import { useEffect, useState } from 'react';
import Name from '@/components/UserProfile/Name';
import ProfilePic from '@/components/UserProfile/ProfilePic';
import Button from '@/components/Button/Button';
import { BiBlock, BiCheck, BiMessageAltDetail } from 'react-icons/bi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import Statistics from '@/components/UserProfile/Statistics';
import Match from '@/components/UserProfile/Match';
import { useCookies } from 'react-cookie';
import type { UserInfos } from 'global';
import jwtDecode from 'jwt-decode';
import Head from 'next/head';

type jwtType = {
	userId: number;
	email: string;
	username: string;
	iat: number;
	exp: number;
}

export default function Profile() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
	const [cookies] = useCookies();
	const [buttonText, setButtonText] = useState<string>('Add friend');
	const [status, setStatus] = useState<string>('');
	const [isBlocked, setIsBlocked] = useState(false);

	function updateButtonState(response: string) {
		if (response === 'ACCEPTED')
			setButtonText('Friend');
		else if (response === 'PENDING')
			setButtonText('Pending request ...');
		else if (response === 'BLOCKED')
			setButtonText('Blocked');
		else if (response === 'RECEIVED')
			setButtonText('Accept request');
		else
			setButtonText('Add friend');
		setStatus(response);
	}

	function toggleBlockStatus() {
		setIsBlocked(!isBlocked);
		updateButtonState(status);
	}

	useEffect(() => {
		if (!router.isReady) return;

		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		const updateBlockStatus = async () => {
			try {
				const statusResponse = await fetch(
					`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
						jwtPayload.username
					)}&addresseeName=${router.query.username}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + cookies['jwt'],
						},
					}
				);
				const status = await statusResponse.text();
				if (status === 'BLOCKED') 
					setIsBlocked(true);
				else 
					setIsBlocked(false);
			} catch (error) {
				console.error(error);
			}
		};
		updateBlockStatus();
	}, [router.isReady, router.query.username, router, cookies]);

	useEffect(() => {
		setStatus(isBlocked ? 'BLOCKED' : 'EMPTY');
		updateButtonState(status);
	}, [isBlocked, status, router.isReady, router.query.username, router, cookies]);

	async function relationshipUpdate() {
		let route = 'add';
		if (status === 'ACCEPTED')
			route = 'remove';
		else if (status === 'PENDING')
			route = 'decline';
		else if (status === 'BLOCKED') {
			route = 'unblock';
			toggleBlockStatus();
		}

		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		const response = await fetch(
			`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/friendship/${route}?requesterName=${encodeURIComponent(
				jwtPayload.username
			)}&addresseeName=${router.query.username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + cookies['jwt'],
				},
			});
		const responseText = await response.text();
		setStatus(responseText);
	}

	useEffect(() => {
		if (!router.isReady) return;

		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		const fetchUserInfo = async () => {
			try {
				const statusResponse = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
					jwtPayload.username
				)}&addresseeName=${router.query.username}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + cookies['jwt'],
					},
				});
				const status = await statusResponse.text();
				let buttonText = 'Add friend';
				if (status === 'ACCEPTED')
					buttonText = 'Friend';
				else if (status === 'PENDING')
					buttonText = 'Pending request ...';
				else if (status === 'BLOCKED')
					buttonText = 'Blocked';
				else if (status === 'RECEIVED')
					buttonText = 'Accept request';
				setStatus(status);
				await fetch(
					`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/users/${router.query.username}`, {
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
		updateButtonState(status);
		fetchUserInfo();
	}, [router.isReady, router.query.username, router, cookies, status]);
		
	return (
		<>
			<Head>
				<title>Profile - {userInfo?.name}</title>
			</Head>
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
											size={90}
											stroke
										/>
										<Name
											Username={userInfo.name}
											FirstName={userInfo.firstName}
											LastName={userInfo.lastName}
											initialIsBlocked={isBlocked}
											toggleBlockStatus={toggleBlockStatus}
											updateButtonState={updateButtonState}
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
											text={buttonText}
											boxShadow={buttonText === 'Add friend' ? true : false}
											onClick={relationshipUpdate}
											theme={buttonText === 'Add friend' ? 'light' : 'dark'}
											icon={buttonText === 'Add friend' ? <AiOutlineUserAdd /> :
												buttonText === 'Blocked' ? <BiBlock /> :
													buttonText === 'Friend' ? <BiCheck /> :
														null}
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
