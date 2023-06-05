import styles from './TextInput.module.scss';

interface Props{
	placeHolder: string;
}

export default function TextInput({placeHolder}: Props) {
	return (
		<input
			className={styles.input}
			type='text'
			placeholder={placeHolder}
		>
			
		</input>
	);
}