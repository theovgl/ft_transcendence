import navbarStyle from '../styles/navbar.module.scss';
import LoginButton from './LoginButton';
import { LoginContext } from '@/utils/contexts/LoginContext';
import { useContext } from 'react';
import NavbarLink from './NavbarLink';

export default function Navbar() {
	const loggedIn = useContext(LoginContext);

	if (!loggedIn) {
		return (
			<nav className={navbarStyle.nav_container}>
				<h1 className={navbarStyle.title}>Transcendence</h1>
				<div className={navbarStyle.button_container}>
					<LoginButton link="/signup" theme='dark'>Signup</LoginButton>
					<LoginButton link="/login" theme='light'>Login</LoginButton>
				</div>
			</nav>
		);
	} else {
		return (
			<nav className={navbarStyle.nav_container}>
				<h1 className={navbarStyle.title}>Transcendence</h1>
				<div className={navbarStyle.links_container}>
					<NavbarLink href="/home">Home</NavbarLink>
					<NavbarLink href="/chat">Chat</NavbarLink>
				</div>
			</nav>
		);
	}
}
