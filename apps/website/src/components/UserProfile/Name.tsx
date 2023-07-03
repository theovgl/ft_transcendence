import styles from '@/styles/userProfile/header.module.scss';
import { UserInfos } from 'global';
import jwtDecode from 'jwt-decode';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BiBlock } from 'react-icons/bi';

interface IName {
  FirstName: string;
  LastName: string;
  Username: string;
}

export default function Name({ FirstName, LastName, Username }: IName) {
	const [isBlocked, setIsBlocked] = useState(false);
	const [cookies] = useCookies();
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);


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

	const toggleBlock = () => {
		let blockString = isBlocked ? 'unblock' : 'block';
		fetch(`http://localhost:4000/friendship/${blockString}?requesterName=${encodeURIComponent(
			jwtDecode(cookies['jwt']).username
			)}&addresseeName=${router.query.username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + cookies['jwt'],
				},
			}
			)
		setIsBlocked(!isBlocked);
		const blockIconElement = document.querySelector('.blockIcon');
  if (blockIconElement) {
    if (isUserBlocked) {
      blockIconElement.classList.add('blocked');
    } else {
      blockIconElement.classList.remove('blocked');
    }
  }

		};

	return (
		<div className={styles.id_container}>
			<p className={styles.fullname}>
				{FirstName + ' ' + LastName}
				<span className={ `${styles.blockIcon} ${isBlocked ? styles.blocked : ''}`} onClick={toggleBlock}>
					<BiBlock size={20} color={isBlocked ? 'red' : 'black'} />
				</span>
			</p>
			<p className={styles.username}>{'@' + Username}</p>
		</div>
	);
}
