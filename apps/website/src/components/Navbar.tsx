<<<<<<< HEAD
import navbarStyle from "@/styles/navbar.module.css"
import Button from "@/components/Button.tsx"


export default function Navbar()
{
	return (
		<>
			<div className={navbarStyle.main}>
				<ul className={navbarStyle.button_list}>
					<li className={navbarStyle.button_wrapper}><a>
						<Button style={navbarStyle.button} label='play'/>
					</a></li>
					<li className={navbarStyle.button_wrapper}><a>
						<Button style={navbarStyle.button} label='chat'/>
					</a></li>
					<li className={navbarStyle.button_wrapper}><a>
						<Button style={navbarStyle.button} label='profile'/>
					</a></li>
				</ul>
			</div>
=======
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
						<ProfilePic path={user?.profilePic} stroke={false} size={35}/>
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
>>>>>>> dev
		</>
	);
}
