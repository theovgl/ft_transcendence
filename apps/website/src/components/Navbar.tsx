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
		</>
	);
}
