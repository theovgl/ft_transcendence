import headerStyle from "@/styles/header.module.css"
import Button from "@/components/Button.tsx"

export interface IHeader
{
	current_page: string,
}


export default function Header(option: IHeader)
{
	return (
		<div className={headerStyle.main}>
				<a className={headerStyle.page_name}>
						{option.current_page}
				</a>
				<div>
					<a className={headerStyle.button_wrapper}>
						<Button style={headerStyle.button} type="button" label="Settings"/>
					</a>
					<a className={headerStyle.button_wrapper}>
						<Button style={headerStyle.button} type="button" label="Disconnect"/>
					</a>
				</div>
		</div>
	);
}
