enum ButtonTypes
{
	button = "button",
	submit = "submit",
	reset = "reset"
}

export interface IButton
{
	label?: string
	type?: "button" | "submit" | "reset";
}

export default function Button(option: IButton)
{
	return (
		<button type={option.type ? option.type : ButtonTypes.button}>
			{option.label ? option.label : "button"}
		</button>
	);
}
