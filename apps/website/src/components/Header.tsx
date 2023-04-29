import homepageStyle from "@/styles/homepage.module.css"
import Button from "@/components/Button.tsx"

export interface IHeader
{
	current_page: string,
}


export default function Header(option: IHeader)
{
	return (
		<div className={homepageStyle.header}>
				<a className={homepageStyle.header_page}>
						{option.current_page}
				</a>
				<div>
					<a className={homepageStyle.a_button_head}>
						<Button style={homepageStyle.button_head} type="button" label="Settings"/>
					</a>
					<a className={homepageStyle.a_button_head}>
						<Button style={homepageStyle.button_head} type="button" label="Disconnect"/>
					</a>
				</div>
		</div>
	);
}
