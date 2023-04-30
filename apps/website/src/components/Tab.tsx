import tabStyle from "@/styles/tab.module.css"
import Button from "@/components/Button.tsx"

export interface ITab
{
	label: string;
	active: boolean;
}


export default function Tab(option: ITab)
{
	return (
		<Button label={option.label} type="button" style={option.active? tabStyle.tab_single : tabStyle.tab_single_active}/>
	);
}
