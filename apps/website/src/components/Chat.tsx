import chatStyle from "@/styles/chat.module.css"
import Button from "@/components/Button.tsx"
import Tab from "@/components/Tab.tsx"
import Contact from "@/components/Contact.tsx"

export default function Chat()
{
	return (
		<div className={chatStyle.grid}>
				<div className={chatStyle.tab_list}>
					<Tab label="General" active={true}/>
					<Tab label="Contact 1" active={false}/>
				</div>
				<div className={chatStyle.contact_list}>
				 contact list
				</div>
				<div className={chatStyle.main}>
					<Contact name="M.Obama" picture="temp" content="salu" context="message"/>
					<Contact name="M.Obama" picture="temp" content="je suis barrack obama" context="message"/>
					<Contact name="M.Obama" picture="temp" content="Je suis l'utilisateur par defaut du projet 42 transcendence" context="message"/>
					<Contact name="M.Obama" picture="temp" content="spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam " context="message"/>
					<Contact name="M.Obama" picture="temp" content="oups" context="message"/>
				</div>
				<div className={chatStyle.input}>
				 message input
				</div>
		</div>
	);
}
