import Link from 'next/link';
import styles from '@/styles/components/NavLink.module.scss';
import { useRouter } from 'next/router';

export interface INavLink {
	href: string,
	children: string
}

export default function NavbarLink(props: INavLink) {
	const router = useRouter();

	return (
		<Link
			className={
				router.pathname == props.href ? 
					styles.active_link : 
					styles.link
			}
			href={ props.href }
		>
			{ props.children }
		</Link>
	);
}