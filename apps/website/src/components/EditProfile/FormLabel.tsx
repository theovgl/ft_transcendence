import styles from './FormLabel.module.scss';

interface Props {
	content: string;
}

export default function FormLabel({content}: Props) {
	return (
		<label className={styles.form_title}>
			{content}
		</label>
	);
}