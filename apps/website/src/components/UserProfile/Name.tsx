import styles from '@/styles/userProfile/header.module.scss';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BiBlock } from 'react-icons/bi';

interface IName {
	FirstName: string;
	LastName: string;
	Username: string;
	initialIsBlocked: boolean;
	toggleBlockStatus: () => void;
	updateButtonState: (response: string) => void;
}

type jwtType = {
	userId: number;
	email: string;
	username: string;
	iat: number;
	exp: number;
}

export default function Name({ FirstName,
	LastName,
	Username,
	initialIsBlocked,
	toggleBlockStatus,
	updateButtonState,
}: IName) {
	const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
	const [cookies] = useCookies();
	const router = useRouter();
	const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

	const isOwnName = jwtPayload.username === router.query.username;

	useEffect(() => {
		setIsBlocked(initialIsBlocked);
	}, [initialIsBlocked]);

	useEffect(() => {
		if (!router.isReady) return;
		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		const updateBlockStatus = async () => {
			try {
				const statusResponse = await fetch(
					`http://localhost:4000/friendship/getRelationship?requesterName=${encodeURIComponent(
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

				setIsBlocked(status === 'BLOCKED');
				updateButtonState(status === 'BLOCKED' ? 'BLOCKED' : 'EMPTY');
			} catch (error) {
				console.error(error);
			}
		};

		updateBlockStatus();
	}, [router.isReady, router.query.username, router, cookies, isBlocked]);

	const toggleBlock = async () => {
		let blockString = isBlocked ? 'unblock' : 'block';
		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);

		try {
			const response = await fetch(
				`http://localhost:4000/friendship/${blockString}?requesterName=${encodeURIComponent(
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
			if (response.ok) {
				setIsBlocked(!isBlocked);
				toggleBlockStatus();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.id_container}>
			<p className={styles.fullname}>
				{FirstName + ' ' + LastName}
				<span
					className={`${styles.blockIcon} ${isBlocked ? styles.blocked : ''}`}
					onClick={toggleBlock}
				>
					{
						!isOwnName &&
						<BiBlock size={ 20 }
							color={isBlocked ? 'red' : 'black'} />
					}
				</span>
			</p>
			<p className={styles.username}>{'@' + Username}</p>
		</div>
	);
}
