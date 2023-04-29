import homepageStyle from "@/styles/homepage.module.css"
import Button from "@/components/Button.tsx"


export default function Navbar()
{
	return (
		<>
			<div className={homepageStyle.navbar}>
				<ul className={homepageStyle.ul}>
					<li className={homepageStyle.element}><a>
						<Button style={homepageStyle.button_nav} label='play'/>
					</a></li>
					<li className={homepageStyle.element}><a>
						<Button style={homepageStyle.button_nav} label='chat'/>
					</a></li>
					<li className={homepageStyle.element}><a>
						<Button style={homepageStyle.button_nav} label='profile'/>
					</a></li>
				</ul>
			</div>
		</>
	);
}
