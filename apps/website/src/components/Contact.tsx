import chatStyle from "@/styles/chat.module.css";
import contactStyle from "@/styles/contact.module.css"
import Button from "@/components/Button.tsx"
import Tab from "@/components/Tab.tsx"
import Image from 'next/image'
import profilePic from '../assets/default_profile_picture.png'

export interface IContact
{
	name: string;
	picture: string;
	content: string;
	context: "message" | "presentation";
}

function choose_content_style(context: string)
{
	if (context == "message")
		return contactStyle.message;
	else if (context == "presentation")
		return contactStyle.presentation;
	return undefined;
}

function choose_name_style(context: string)
{
	if (context == "message")
		return contactStyle.name;
	else if (context == "presentation")
		return contactStyle.name_presentation;
	return undefined;
}

export default function Contact(option: IContact)
{
	return (
	<>
		<div className={contactStyle.grid}>
		<div className={contactStyle.picture}>
			<Image 
			alt="Obamna"
			src={profilePic}
			/>
			</div>
		<div className={choose_name_style(option.context)}>
		<button className={chatStyle.channelhook}>
			{option.name}	
		</button>
		</div>
			<p className={choose_content_style(option.context)}>
				{option.content}
			</p>
		</div>
	</>
	);
}
