import tabStyle from "@/styles/tab.module.css"
import Button from "@/components/Button.tsx"
import {useState} from "react"


export interface ITab
{
	label: string;
	active: boolean;
}

export default function Tab(option: ITab)
{
	const [buttonIsActive, changeButtonIsActive ] = useState(tabStyle.tab_single);

	const ChangeTab = () => {
		if (buttonIsActive == tabStyle.tab_single)
			changeButtonIsActive(tabStyle.tab_single_active);
		else
			changeButtonIsActive(tabStyle.tab_single);
		console.log("cool");
	}
	return (
		<Button 
			onClickFunction={ChangeTab}	
			label={option.label} 
			type="button" 
			style={buttonIsActive}/>


	);
}
