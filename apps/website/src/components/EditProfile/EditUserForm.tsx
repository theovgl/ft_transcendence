import LabeledInput from './LabeledInput';
import styles from './EditUserForm.module.scss';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormValues {
	'Email': string;
	'First Name': string;
	'Last Name': string;
}

export default function EditUserForm() {
	const { register, handleSubmit } = useForm<IFormValues>();

	const onSubmit: SubmitHandler<IFormValues> = data => (
		console.log(data)
	);

	return (
		<form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.formSection}>
				<LabeledInput label='First Name' register={register} required/>
				<LabeledInput label='Last Name' register={register} required/>
			</div>
			<div className={styles.formSection}>
				<LabeledInput label='Email' register={register} required/>
			</div>
			<button type="submit">Submit</button>
		</form>
	);
}