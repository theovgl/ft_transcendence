import Button from '@/components/Button/Button';
import Navbar from '@/components/Navbar';
import Name from '@/components/UserProfile/Name';
import ProfilePic from '@/components/UserProfile/ProfilePic';
import Statistics from '@/components/UserProfile/Statistics';
import Match from '@/components/UserProfile/Match';
import { useCookies } from 'react-cookie';
import type { UserInfos, MatchInfos } from 'global';
import styles from '@/styles/userProfile/userProfile.module.scss';
import { SocketContext } from '@/utils/contexts/SocketContext';
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BiBlock, BiCheck, BiEdit, BiMessageAltDetail } from 'react-icons/bi';

type jwtType = {
	userId: number;
	email: string;
	username: string;
	displayName: string;
	iat: number;
	exp: number;
}

export default function Profile() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
	const [cookies] = useCookies();
	const [matches, setMatches] = useState<Array<MatchInfos>>([]);
	const [buttonText, setButtonText] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	const [isBlocked, setIsBlocked] = useState(false);
	const username = router.query.username as string;
	const socketContext = useContext(SocketContext);
	const socket = socketContext?.socket;

	function updateButtonState(response: string) {
		if (response === 'ACCEPTED')
			setButtonText('Friend');
		else if (response === 'PENDING')
			setButtonText('Pending request ...');
		else if (response === 'BLOCKED')
			setButtonText('Blocked');
		else if (response === 'RECEIVED')
			setButtonText('Accept request');
		else if (response === 'EDIT')
			setButtonText('Edit profile');
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

		const user_matches = async () => {
			try {
				const statusResponse = await fetch(
					`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/users/${router.query.username}/matches`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + cookies['jwt'],
						},
					}
				)
					.then((response) => {
						if (!response.ok) {
							if (response.status === 404) {
								router.push('/404');
								return null;
							}
							throw new Error('Failed to fetch match info');
						} else
							return response.json();
					})
					.then((response: MatchInfos[]) => {
						setMatches(response);
					});
			} catch (error) {
				console.error(error);
			}
		};
		user_matches();
	}, [router]);

	// This useEffect is used to update the button text when the user changes as blocked or unblocked
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
	}, [router.query.username]);

	function redirectToEdit() {
		router.push('/user/edit');
	}

	const startDm = () => {
		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		router.push({
			pathname: '/chat',
			query: {
				addresseeName: `${router.query.username}`,
				requesterName: encodeURIComponent(jwtPayload.username),
			}
		});
	};

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
		let responseText = await response.text();
		if (encodeURIComponent(jwtPayload.username) === router.query.username)
			responseText = 'EDIT';
		setStatus(responseText);
	}

	// Verify if the user exists and setUserInfo. Fetch the relationship status between the user and the profile owner and set the button text
	useEffect(() => {
		if (!router.isReady) return;

		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		const fetchUserInfo = async () => {
			try {
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
				const statusResponse = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
					jwtPayload.username
				)}&addresseeName=${router.query.username}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + cookies['jwt'],
					},
				});
				let status = await statusResponse.text();
				let buttonText = 'Add friend';
				if (status === 'ACCEPTED')
					buttonText = 'Friend';
				else if (status === 'PENDING')
					buttonText = 'Pending request ...';
				else if (status === 'BLOCKED')
					buttonText = 'Blocked';
				else if (status === 'RECEIVED')
					buttonText = 'Accept request';
				else if (encodeURIComponent(jwtPayload.username) === router.query.username) {
					status = 'EDIT';
					buttonText = 'Edit profile';
				}
				setStatus(status);
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
				<title>Profile - {userInfo?.displayName}</title>
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
											currentUser={username}
										/>
										<Name
											Username={userInfo.displayName}
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
											onClick={startDm}
										/>
										<Button
											text={buttonText}
											boxShadow={buttonText === 'Add friend' ||
													buttonText === 'Edit profile' ? true : false}
											onClick={buttonText === 'Edit profile' ? redirectToEdit : relationshipUpdate}
											theme={buttonText === 'Add friend' ||
													buttonText === 'Edit profile' ? 'light' : 'dark'}
											icon={buttonText === ('Add friend') ? <AiOutlineUserAdd /> :
												buttonText === 'Edit profile' ? <BiEdit /> :
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
											winRate={userInfo.wins && userInfo.losses ?
												userInfo.wins / userInfo.losses: 'N/A'}
										/>
									</section>
									<section className={styles.content_section}>
										<h2 className={styles.title2}>Match history</h2>
										{
											matches.map((match, i) => (
												<Match
													key={i}
													player1Name = {match.userIdLeft}
													player2Name =  {match.userIdRight}
													player1Score = {match.scorePlayerOne}
													player2Score = {match.scorePlayerTwo}
													matchDuration = {match.duration}
													winnerId= {match.winnerId}
												/>
											))
										}
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
