import styles from '@/styles/userProfile/header.module.scss';

interface IName {
	FirstName: string;
	LastName: string;
	Username: string;
}

export default function Name({ FirstName, LastName, Username }: IName) {
	return (
		<div className={styles.id_container}>
			<p className={styles.fullname} >{ FirstName + ' ' + LastName }</p>
			<p className={styles.username}>{ '@' + Username }</p>
		</div>
	);
}
