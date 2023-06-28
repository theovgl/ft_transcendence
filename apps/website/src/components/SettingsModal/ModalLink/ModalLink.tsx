import Link from 'next/link';
import style from './ModalLink.module.scss';
import React from 'react';

export interface ModalLinkProps {
	title: string;
	href: string;
	icon?: React.ReactElement;
}

export default function ModalLink(props: ModalLinkProps) {
	return (
		<ul className={style.modal_link_list}>
			<li>
				<Link className={style.modal_link} href={props.href}>
					{props.icon}
					{props.title}
				</Link>
			</li>
		</ul>
	);
}