import React, {useContext, useEffect, useState} from 'react';
import style from './SettingsModal.module.scss';
import ModalLink from './ModalLink/ModalLink';
import {AuthContext} from '@/utils/contexts/AuthContext';
import { BiSolidChat, BiSolidGroup, BiSolidPencil, BiSolidUser } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { useCookies } from 'react-cookie';
import { UserInfos } from 'global';
import ProfilePic from '../UserProfile/ProfilePic';

export default function SettingsModal() {
	const { user } = useContext(AuthContext);
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
	const [ cookies ] = useCookies();
	
	const fetchUserInfo = async (username: string) => {
		try {
			await fetch(
				`http://localhost:4000/users/${username}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + cookies['jwt'],
					},
				})
				.then((response) => {
					if (!response.ok) {
						if (response.status === 404)
							return null;
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

	useEffect(() => {
		const username: string | undefined  = user?.name;

		console.log(username);
		if (username)
			fetchUserInfo(username);
	});
	
	return (
		<>
			<div className={style.modal_main}>
				<div className={style.modal_header}>
					<div className={style.modal_userInfo}>
						<ProfilePic
							path={userInfo?.profilePicPath}
							size={30} stroke={false}
						/>
						<p className={style.modal_username}>tvogel</p>
					</div>
					<RxCross2 />
				</div>
				<div className={style.modal_links_container}>
					<ModalLink title='Your profile' href='/' icon={ <BiSolidUser /> }/>
					<ModalLink title='Edit your profile' href='/' icon={ <BiSolidPencil /> }/>
					<ModalLink title='Your friends' href='/' icon={ <BiSolidGroup /> }/>
					<ModalLink title='Chat' href='/chat' icon={<BiSolidChat />}/>
				</div>
			</div>
		</>
	);
}