import styles from '@/styles/components/LoginButton.module.scss';
import Link from 'next/link';

enum ButtonThemes {
	dark = 'dark',
	light = 'light'
}

export interface ILoggingButton
{
	theme: string
	link: string
	children?: string;
}

export default function LoginButton(option: ILoggingButton) {
	return (
		<div className={styles[option.theme]}>
			<Link
				href={option.link}
				className={styles.link}
			>
				{option.children}
			</Link>
		</div>
	);
}

