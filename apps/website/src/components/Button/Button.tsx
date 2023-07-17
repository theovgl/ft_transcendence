import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string,
	icon?: React.ReactElement | null,
	boxShadow?: boolean,
	theme?: string,
}

const Button: React.FC<ButtonProps> = ({text, icon, boxShadow, theme, ...props}) => {
	return (
		<button
			className={
				`
					${styles.btn}
					${theme === 'light' ? styles.btn_light : styles.btn_dark}
					${boxShadow ? styles.shadow : null}
				`
			}
			{...props}>
			{text}
			{icon ? icon : null}
		</button>
	);
};

export default Button;