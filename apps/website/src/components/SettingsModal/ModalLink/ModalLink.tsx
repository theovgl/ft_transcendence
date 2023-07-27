import Link from 'next/link';
import style from './ModalLink.module.scss';
import React from 'react';

export interface ModalLinkProps {
	title: string;
	href: string;
	icon?: React.ReactElement;
	onClick?: () => void;
}

export default function ModalLink(props: ModalLinkProps) {
	return (
		<li>
			<Link
				onClick={props.onClick}
				className={style.modal_link}
				href={props.href}
			>
				{props.icon}
				{props.title}
			</Link>
		</li>
	);
}