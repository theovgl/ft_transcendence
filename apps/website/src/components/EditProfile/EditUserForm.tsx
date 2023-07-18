import styles from './EditUserForm.module.scss';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../Button/Button';
import { BiPencil, BiSave } from 'react-icons/bi';
import FormLabel from './FormLabel';
import { useUser } from '@/utils/hooks/useUser';
import jwtDecode from 'jwt-decode';
import { useCookies } from 'react-cookie';

interface IFormValues {
	'Nickname': string;
	'ProfilePic': FileList;
}

type jwtType = {
	userId: number;
	email: string;
	username: string;
	iat: number;
	exp: number;
}

export default function EditUserForm() {
	const [cookies] = useCookies();
	const { user } = useUser();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>();

	// const onSubmit: SubmitHandler<IFormValues> = (data: any) => {
	// 	if (!data) return;

	// 	if (data.Nickname) {
	// 		const jwtPayload: jwtType = jwtDecode<jwtType>(cookies['jwt']);
	// 		const lowerNickname = data.Nickname.toLowerCase();
	// 		console.log('nickname', lowerNickname);
	// 		console.log('payload', jwtPayload);

	// 		try {
	// 			fetch(`http://localhost:4000/users/edit?requesterName=${encodeURIComponent(
	// 				jwtPayload.username
	// 			)}`, {
	// 				method: 'POST',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: 'Bearer ' + cookies['jwt'],
	// 				},
	// 			});
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// };

	return (
		<form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.formSection}>
				<FormLabel content='Profile picture '/>
				<input
					className={styles.inputFile}
					type="file"
					id="picture"
					accept='image/png, image/jpeg'
					{...register('ProfilePic')}
				/>
				<label
					className={styles.inputLabel}
					htmlFor="picture"
					style={{
						backgroundImage: `
							url(${user ? user.profilePic : '/default_profil_picture.jpg'})
						`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						position: 'relative',
					}}
				>
					<BiPencil className={styles.inputIcon} />
				</label>
			</div>
			<div className={styles.formSection}>
				<FormLabel content='Change nickname' />
				<div className={styles.labeledInput_container}>
					<input
						className={styles.input}
						type='text'
						placeholder='Change nickname'
						{...register('Nickname', {
							maxLength: {
								value: 32,
								message: 'Nickname cannot be longer than 32 characters'
							}
						})}
					/>
				</div>
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