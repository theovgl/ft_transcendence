import { Children, PropsWithChildren } from 'react';
import React from 'react';
import styles from './Button.module.scss';
import { IconType } from 'react-icons';

interface Props {
	text: string,
	icon?: React.ReactElement,
	boxShadow?: boolean,
	theme?: string
}

export default function Button({
	text = 'click',
	boxShadow = true,
	theme = 'light',
	icon = undefined
}: PropsWithChildren<Props>
) {
	return (
		<button className={
			`
				${styles.btn}
				${theme === 'light' ? styles.btn_light : styles.btn_dark}
				${boxShadow ? styles.shadow : null}
			`
		}>
			{text}
			{icon ? icon : null}
		</button>
	);
}