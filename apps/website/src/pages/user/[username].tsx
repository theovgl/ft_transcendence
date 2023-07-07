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

	// useEffect(() => {
	// 	console.log('before status: ', status);
	// 	updateButtonState(status);
	// 	console.log('after status: ', status);
	// }, [status]);

	function toggleBlockStatus() {
		setIsBlocked(!isBlocked);
		updateButtonState(status);
	  }
	  
	  useEffect(() => {
		console.log('before isBlocked: ', isBlocked);
		setStatus(isBlocked ? 'BLOCKED' : 'EMPTY');
		console.log('after isBlocked: ', isBlocked);
		updateButtonState(status);
	  }, [isBlocked, status]);
	  
	
	async function relationshipUpdate() {

		let route = 'add';
		if (status === 'ACCEPTED')
		route = 'remove';
		else if (status === 'PENDING')
		route = 'decline';
		else if (status === 'BLOCKED')
		route = 'unblock';
		
		const response = await fetch(
			`http://localhost:4000/friendship/${route}?requesterName=${encodeURIComponent(
				jwtDecode(cookies['jwt']).username
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
		const fetchUserInfo = async () => {
			try {
				const statusResponse = await fetch(`http://localhost:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
					jwtDecode(cookies['jwt']).username
				)}&addresseeName=${router.query.username}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + cookies['jwt'],
					},
				});
				const status = await statusResponse.text();
				console.log('status after fetch getRel: ', status);
				let buttonText = 'Add friend';
				if (status === 'ACCEPTED')
					buttonText = 'Friend';
				else if (status === 'PENDING')
					buttonText = 'Pending request ...';
				else if (status === 'BLOCKED')
				{
					setIsBlocked(true);
					buttonText = 'Blocked';
				}
				else if (status === 'RECEIVED')
					buttonText = 'Accept request';
				setStatus(status);
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
			console.log('buttonText: ', buttonText);
			} catch (error) {
				console.error(error);
			}
		};
		updateButtonState(status);
		fetchUserInfo();
	}, [router.isReady, router.query.username, router, cookies, status]);
		
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
											initialIsBlocked={isBlocked}
											toggleBlockStatus={toggleBlockStatus}										/>
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
