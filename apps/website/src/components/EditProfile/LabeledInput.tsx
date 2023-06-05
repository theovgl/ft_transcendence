import FormLabel from './FormLabel';
import styles from './LabeledInput.module.scss';
import TextInput from './TextInput';

interface Props {
	title: string;
	inputPlaceholder: string;
}

export default function LabeledInput({title, inputPlaceholder}: Props) {
	return (
		<div className={styles.labeledInput_container}>
			<FormLabel content={title}/>
			<TextInput placeHolder={inputPlaceholder}/>
		</div>
	);
}