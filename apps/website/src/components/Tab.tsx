import tabStyle from "@/styles/tab.module.css"
import Button from "@/components/Button.tsx"
import {useState} from "react"


export interface ITab
{
	label: string;
	active: boolean;
	onClick: () => boolean;
}

export default function Tab(option: ITab)
{
	const [buttonIsActive, changeButtonIsActive ] = useState(
		option.active ? tabStyle.tab_single_active : tabStyle.tab_single
	);

	const ChangeTab = () => {
		option.onClick();
	}
	//implement signal create tab to server
	return (
		<Button 
			onClickFunction={ChangeTab}	
			label={option.label} 
			type="button" 
			style={option.active ? tabStyle.tab_single_active : tabStyle.tab_single}/>
	);
}
