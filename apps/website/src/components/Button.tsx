import formStyle from '@/styles/form.module.css';

enum ButtonTypes
{
	button = 'button',
	submit = 'submit',
	reset = 'reset'
}

export interface IButton
{
	label?: string;
	type?: 'button' | 'submit' | 'reset';
	style?: string;
}

export default function Button(option: IButton) {
	return (
		<button className={option.style}
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
