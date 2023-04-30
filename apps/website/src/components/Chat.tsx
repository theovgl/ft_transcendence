import homepageStyle from "@/styles/homepage.module.css"
import chatStyle from "@/styles/chat.module.css"
import Button from "@/components/Button.tsx"


export default function Chat()
{
	return (
		<div className={chatStyle.grid}>
				<div className={chatStyle.tab_list}>
						Chat tab			
				</div>
				<div className={chatStyle.contact_list}>
				 contact list
				</div>
				<div className={chatStyle.main}>
				 chat main
				</div>
				<div className={chatStyle.input}>
				 message input
				</div>
		</div>
	);
}
