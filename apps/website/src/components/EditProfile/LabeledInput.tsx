import React from 'react';
import FormLabel from './FormLabel';
import styles from './LabeledInput.module.scss';
import { Path, UseFormRegister, ValidationRule } from 'react-hook-form';

interface IFormValues {
	'Email': string;
	'First Name': string;
	'Last Name': string;
}

type InputProps = {
	label: Path<IFormValues>;
	register: UseFormRegister<IFormValues>;
	required: boolean;
	pattern?: ValidationRule<RegExp>;
}

export default function LabeledTextInput({label, register, required, pattern }: InputProps) {
	return (
		<div className={styles.labeledInput_container}>
			<FormLabel content={label}/>
			<input
				className={styles.input}
				type='text'
				placeholder={label}
				{...register(label, { required, pattern })}
			/>
		</div>
	);
}