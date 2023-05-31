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
	const [buttonIsActive, changeButtonIsActive ] = useState(
		option.active ? tabStyle.tab_single : tabStyle.tab_single_active
	);

	const ChangeTab = () => {
		if (buttonIsActive == tabStyle.tab_single)
			changeButtonIsActive(tabStyle.tab_single_active);
		else
			changeButtonIsActive(tabStyle.tab_single);
	}
	//implement signal create tab to server
	return (
		<Button 
			onClickFunction={ChangeTab}	
			label={option.label} 
			type="button" 
			style={buttonIsActive}/>
	);
}
