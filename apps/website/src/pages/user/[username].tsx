import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import styles from '@/styles/userProfile/userProfile.module.scss';
import { useEffect, useState } from 'react';
import Name from '@/components/UserProfile/Name';
import ProfilePic from '@/components/UserProfile/ProfilePic';
import Button from '@/components/Button/Button';
import { BiCheck, BiMessageAltDetail } from 'react-icons/bi';
import Statistics from '@/components/UserProfile/Statistics';
import Match from '@/components/UserProfile/Match';

export default function Profile() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<IUserInfos | undefined>(undefined);

	useEffect(() => {
		if (!router.isReady) return;
		const fetchUserInfo = async () => {
			try {
				const response = await fetch(`http://localhost:4000/users/${router.query.username}`);
				if (!response.ok) {
					if (response.status === 404) {
						router.push('/404');
						return null;
					}
					throw new Error('Failed to fetch user info');
				}
				const data = await response.json();
				setUserInfo(data);
				console.table(userInfo);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUserInfo();
	}, [router.isReady, router.query.username]);

	return (
		<>
			<Navbar />
			<main className={styles.main}>
				{
					userInfo ? (
						<>
							<div className={styles.header}>
								<div className={styles.user_id_container}>
									<ProfilePic path={'http://backend:4000/users/profile-picture/' + userInfo.profilePicPath} />
									<Name Username={userInfo.name} FirstName={userInfo.firstName} LastName={userInfo.lastName} />
								</div>
								<div className={styles.header_buttons_container}>
									<Button text='Message' icon={<BiMessageAltDetail />}/>
									<Button text='Friend' boxShadow={false} theme='dark' icon={<BiCheck />}/>
								</div>
							</div>
							<div className={styles.content_container}>
								<section className={styles.content_section}>
									<h2 className={styles.title2}>Statistics</h2>
									<Statistics
										level={userInfo.level}
										wins={userInfo.wins}
										looses={userInfo.looses}
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
								</section>
							</div>
						</>
					) : ( <p>Loading...</p> )
				}
			</main>
		</>
	);
}
