import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Socket } from 'socket.io-client';
import Button from '../Button/Button';
import FormLabel from '../EditProfile/FormLabel';
import styles from './CreateRoomForm.module.scss';

interface UseFormInputs {
	roomName: string
	password: string
	privateToggle: string
}

interface  CreateRoomFormProps{
	socket: Socket
}

export default function CreateRoomForm({ socket }: CreateRoomFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UseFormInputs>();
	const [passwordInputType, setPasswordInputType] = useState<string>('password');

	const onSubmit = (data: UseFormInputs) => {
		console.log(data);
		reset();
		// socket.emit('createRoom', data.roomName, 'public')
		// createRoom
	};

	return (
		<div className={styles.createRoom_container}>
			<form
				className={styles.createRoom_form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<p className={styles.createRoom_title}>Create or join a room</p>
				<div className={styles.input_label_container}>
					<FormLabel content='Room name'/>
					<input
						type='text'
						className={`
							${styles.input}
							${errors.roomName ? styles.input_error : ''}
						`}
						{...register('roomName',
							{
								required: {
									value: true,
									message: 'This field is required'
								},
								pattern: {
									value: /^[a-zA-Z0-9_]*$/,
									message: 'Invalid Input. Only use a-z, A-Z, 0-9, and _.'
								}
							})
						}
					/>
					<span className={`
							${errors.roomName ? styles.error_message : styles.error_message_invisible}
						`}
					>{errors.roomName && errors.roomName.message}</span>
				</div>
				<div className={styles.input_label_container}>
					<FormLabel content='Password'/>
					<input
						type={passwordInputType}
						className={`
							${styles.input}
							${errors.password ? styles.input_error : ''}
						`}
						{...register('password')}/>
					<span
						className={styles.hidePassword}
						onClick={() => {
							passwordInputType === 'password' ? 
								setPasswordInputType('text') : 
								setPasswordInputType('password');
						}}
					>
						{passwordInputType === 'password' ? 'Show password' : 'Hide password'}
					</span>
				</div>
				<div className={styles.privateField_container}>
					<span>Private ?</span>
					<input type="checkbox" {...register('privateToggle')}/>
				</div>
				<Button text='Join !' type='submit'/>
			</form>
		</div>
	);
}