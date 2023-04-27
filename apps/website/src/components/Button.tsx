export interface IButton
{
	label: string
	type: string
}

export default function Button(option: IButton)
{
	return (
		<button type={option.type ? option.type : "button"}>
			{option.label ? option.label : "button"}
		</button>
	);
}
