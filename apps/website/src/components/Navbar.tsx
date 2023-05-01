import navbarStyle from "../styles/navbar.module.scss";
import Button from "@/components/Button.tsx";
import LoginButton from "./LoginButton";
import { LoginContext } from "@/utils/contexts/LoginContext";
import { useContext } from "react";

export default function Navbar()
{
	const loggedIn = useContext(LoginContext);

	if (!loggedIn) {
		return (
			<nav className={navbarStyle.nav_container}>
				<h1 className={navbarStyle.title}>Transcendence</h1>
				<div className={navbarStyle.links_container}>
					<LoginButton theme='dark'>Signup</LoginButton>
					<LoginButton theme='light'>Login</LoginButton>
				</div>
			</nav>
		)
	}
	else {
		return (
			<nav className={navbarStyle.nav_container}>
				<h1 className={navbarStyle.title}>Transcendence</h1>
			</nav>
		)
	}
}

/*
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
		</>
	);
*/