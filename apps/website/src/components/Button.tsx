import formStyle from '@/styles/form.module.css';

enum ButtonTypes
{
	button = 'button',
	submit = 'submit',
	reset = 'reset'
}

export interface IButton
{
	label: string
	type: string
}

export default function Button(option: IButton) {
	return (
		<button className={formStyle.row}
			type={option.type
				? option.type
				: ButtonTypes.button}
		>
			{option.label
				? option.label
				: 'button'}
		</button>
	);
}
