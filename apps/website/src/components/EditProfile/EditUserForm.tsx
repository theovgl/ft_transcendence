import LabeledInput from './LabeledInput';
import styles from './EditUserForm.module.scss';
import React from 'react';
import { useForm, SubmitHandler, ValidationRule } from 'react-hook-form';
import Button from '../Button/Button';
import { BiSave } from 'react-icons/bi';

const emailRegex: ValidationRule<RegExp> = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

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
				<LabeledInput
					label='Email'
					register={register}
					pattern={emailRegex}
					required
				/>
			</div>
			<Button
				text='Save changes'
				type='submit' 
				theme='light'
				icon={<BiSave />}
				boxShadow 
			/>
		</form>
	);
}