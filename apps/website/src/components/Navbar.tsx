import navbarStyle from '../styles/navbar.module.scss';
import LoginButton from './LoginButton';
import NavbarLink from './NavbarLink';
import Link from 'next/link';
import { useAuth } from '@/utils/hooks/useAuth';
import SettingsModal from './SettingsModal/SettingsModal';
import { useContext } from 'react';
import { AuthContext } from '@/utils/contexts/AuthContext';

export default function Navbar() {
	const auth = useContext(AuthContext);

	if (auth?.isAuthenticated === false) {
		return (
			<nav className={navbarStyle.nav_container}>
				<Link className={navbarStyle.title} href='/'>Transcendence</Link>
				<div className={navbarStyle.button_container}>
					<LoginButton link="/login" theme='light'>Login</LoginButton>
				</div>
			</nav>
		);
	} else {
		return (
			<>
				<nav className={navbarStyle.nav_container}>
					<h1 className={navbarStyle.title}>Transcendence</h1>
					<div className={navbarStyle.links_container}>
						<NavbarLink href="/home">Home</NavbarLink>
						<NavbarLink href="/chat">Chat</NavbarLink>
					</div>
				</nav>
				<SettingsModal />
			</>
		);
	}
}
