import { useUser } from '@/utils/hooks/useUser';
import { useCookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiPencil, BiSave } from 'react-icons/bi';
import Button from '../Button/Button';
import styles from './EditUserForm.module.scss';
import FormLabel from './FormLabel';

interface IFormValues {
	'Nickname': string;
	'ProfilePic': FileList;
}

export default function EditUserForm() {
	const [cookies] = useCookies();
	const { user, editUser } = useUser();

	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>();

	const saveNewDisplayName = (newDisplayName: string) => {
		editUser({ displayName: newDisplayName});
	};

	const saveNewProfilPic = (newPath: string) => {
		editUser({ profilePic: `/images/profile-pictures/${newPath}` });
	};

	const submitDisplayName = async (newDisplayName: string) => {
		const lowerCaseName = newDisplayName.toLowerCase();
		const body = {
			newDisplayName: lowerCaseName,
		};

		try {
			const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/users/edit?user=${encodeURIComponent(
				user!.name
			)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + cookies['jwt'],
				},
				body: JSON.stringify(body)
			});
			if (!response.ok)
				throw new Error(response.statusText);

			saveNewDisplayName(lowerCaseName);
		} catch (e: any) {
			if (e.message === 'Conflict') {
				setError('Nickname', {
					type: 'server',
					message: 'Display name already in use',
				});
			} else {
				setError('Nickname', {
					type: 'server',
					message: 'Something went wrong while setting the displayname',
				});
			}
		}
	};

	const submitProfilePic = async (data: any) => {
		const formData = new FormData();
		formData.append('profile-picture', data[0]);

		try {
			const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000/users/profile-picture?user=${encodeURIComponent(
				user!.name
			)}`, {
				method: 'PATCH',
				body: formData,
				headers: {
					Authorization: 'Bearer ' + cookies['jwt'],
				},
			});
			if (response.ok) {
				const responseJSON = await response.json();
				saveNewProfilPic(responseJSON.imageID);
			}
		} catch (error) {
			console.error(error);
		}

	};

	const onSubmit: SubmitHandler<IFormValues> = async (data: any) => {
		if (!data) return;

		if (data.ProfilePic.length === 1)
			await submitProfilePic(data.ProfilePic);
		if (data.Nickname)
			await submitDisplayName(data.Nickname);
	};

	return (
		<form id='editForm' className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.formSection}>
				<FormLabel content='Profile picture '/>
				<input
					className={styles.inputFile}
					type="file"
					id="picture"
					accept='image/png, image/jpeg, image/webp'
					{...register('ProfilePic')}
				/>
				<label
					className={styles.inputLabel}
					htmlFor="picture"
					style={{
						backgroundImage: `
							url(${user ? user.profilePic : ''})
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
						className={`
							${styles.input}
							${errors.Nickname ? styles.input_error : ''}
						`}
						type='text'
						placeholder={user?.displayName}
						{...register('Nickname', {
							maxLength: {
								value: 32,
								message: 'Display name cannot be longer than 32 characters'
							},
							pattern: {
								value: /^[a-zA-Z0-9_]*$/,
								message: 'Invalid Input. Only use a-z, A-Z, 0-9, and _.'
							}
						})}
					/>
					<span className={`
							${errors.Nickname ? styles.error_message : styles.error_message_invisible}
						`}
					>{errors.Nickname && errors.Nickname.message}</span>
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