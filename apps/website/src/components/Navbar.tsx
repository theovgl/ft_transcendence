import navbarStyle from '../styles/navbar.module.scss';
import LoginButton from './LoginButton';
import Link from 'next/link';
import SettingsModal from './SettingsModal/SettingsModal';
import { useState } from 'react';
import { useUser } from '@/utils/hooks/useUser';
import ProfilePic from './UserProfile/ProfilePic';
import { useAuth } from '@/utils/hooks/useAuth';

export default function Navbar() {
	const { isAuthenticated } = useAuth();
	const [isModalOpen, setIsModalOpen ]= useState(false);
	const { user } = useUser();

	return (
		<>
			<nav className={navbarStyle.nav_container}>
				<Link className={navbarStyle.title} href='/'>Transcendence</Link>
				{isAuthenticated ? (
					<div
						className={navbarStyle.profilePicButton}
						onClick={() => setIsModalOpen(true)}
					>
						<ProfilePic path={user?.profilePic} stroke={false} size={35} currentUser={user?.name}/>
					</div>
				) : (
					<div className={navbarStyle.button_container}>
						<LoginButton link="/login" theme='light'>Login</LoginButton>
					</div>
				)}
			</nav>
			{isAuthenticated && (
				<SettingsModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
		</>
	);
}
