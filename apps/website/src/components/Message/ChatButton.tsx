import React from 'react';
import styles from './ChatButton.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string,
	icon?: React.ReactElement | null,
}

const ChatButton: React.FC<ButtonProps> = ({text, icon, tooltipText, ...props}) => {
	return (
		<button
			className={styles.btn}
			{...props}>
			{icon ? icon : null}
			{text}
		</button>
	);
};

export default ChatButton;