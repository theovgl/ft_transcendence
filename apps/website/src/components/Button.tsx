import formStyle from "@/styles/form.module.css"

enum ButtonTypes
{
	button = "button",
	submit = "submit",
	reset = "reset"
}

export interface IButton
{
	label?: string;
	type?: "button" | "submit" | "reset";
	style?: string;
	onClickFunction?: () => void;
}

export default function Button(option: IButton)
{
const ChangeTab = (e:any) => {
	//it triggers by pressing the enter key
//	if (active == false)
//		active = true;
	e.preventDefault();
	console.log("cool");
}
	return (
		<button 
			onClick={option.onClickFunction}
			className={option.style}
			type={option.type ? option.type : ButtonTypes.button}
		>
			{option.label ? option.label : "button"}
		</button>
	);
}
