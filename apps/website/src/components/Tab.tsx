import tabStyle from "@/styles/tab.module.css"
import Button from "@/components/Button.tsx"

export interface ITab
{
	label: string;
	active: boolean;
}

let active: boolean;

active = false;


export default function Tab(option: ITab)
{
const ChangeTab = (e) => {
	//it triggers by pressing the enter key
	if (active == false)
		active = true;
	e.preventDefault();
	console.log("cool");
}
	return (
		<Button 
			onClickFunction={ChangeTab}	
			label={option.label} 
			type="button" 
			style={active? tabStyle.tab_single : tabStyle.tab_single_active}/>


	);
}
