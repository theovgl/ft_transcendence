import { SocketContext } from '@/utils/contexts/SocketContext';
import { useAuth } from '@/utils/hooks/useAuth';
import { useUser } from '@/utils/hooks/useUser';
import React, { useContext } from 'react';
import {
	BiSolidChat,
	BiSolidExit,
	BiSolidHome,
	BiSolidPencil,
	BiSolidUser
} from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import ProfilePic from '../UserProfile/ProfilePic';
import ModalLink from './ModalLink/ModalLink';
import style from './SettingsModal.module.scss';

type SettingsModalProps = {
	isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingsModal(props: SettingsModalProps) {
	const { user } = useUser();
	const { logout } = useAuth();
	const { isModalOpen, setIsModalOpen } = props;
	const socket = useContext(SocketContext);

	const handleLogout = () => {
		setIsModalOpen(false);
		socket?.socket?.emit('quit');
		socket?.socket?.emit('quitGame', user?.name);
		socket?.socket?.emit('removeConnectedUser', user?.name);
		socket?.socket?.on('cleared', () => {
			socket?.socket?.disconnect();
		});
		logout();
	};

	return (
		<>
			<div
				onClick={() => {
					setIsModalOpen(false);
				}}
				className={`${style.overlay} ${isModalOpen ? '' : style.hidden}`}
			/>
			<div className={`${style.modal_main} ${isModalOpen ? '' : style.hidden}`}>
				<div className={style.modal_header}>
					<div className={style.modal_userInfo}>
						<ProfilePic
							path={user?.profilePic}
							size={30} stroke={false} currentUser={user?.name}
						/>
						<p className={style.modal_username}>{user?.displayName}</p>
					</div>
					<RxCross2 onClick={() => setIsModalOpen(!isModalOpen)} />
				</div>
				<ul
					className={`
						${style.modal_link_list}
						${isModalOpen ? '' : style.hidden}
					`}
				>
					<ModalLink
						title='Home'
						href='/'
						icon={ <BiSolidHome /> }
						onClick={() => setIsModalOpen(false)}
					/>
					<ModalLink
						title='Your profile'
						href={'/user/' + user?.name}
						icon={ <BiSolidUser /> }
						onClick={() => setIsModalOpen(false)}
					/>
					<ModalLink
						title='Edit your profile'
						href='/user/edit'
						icon={ <BiSolidPencil /> }
						onClick={() => setIsModalOpen(false)}
					/>
					<ModalLink
						title='Chat'
						href='/chat'
						icon={<BiSolidChat />}
						onClick={() => setIsModalOpen(false)}
					/>
					<ModalLink
						title='Logout'
						href='/login'
						icon={<BiSolidExit />}
						onClick={() => handleLogout()}
					/>
				</ul>
			</div>
		</>
	);
}