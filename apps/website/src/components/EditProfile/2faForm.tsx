import Image from 'next/image';
import { useForm } from 'react-hook-form';
import FormLabel from './FormLabel';
import styles from './EditUserForm.module.scss';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useUser } from '@/utils/hooks/useUser';

interface IFormValues {
	'checkbox': Boolean;
	'tfaCode': string;
}

export default function TwoFaForm() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [is2faEnable, setIs2faEnable] = useState<boolean>(false);
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [isPromptDisplayed, setIsPromptDisplayed] = useState<boolean>(false);
	const [cookies] = useCookies();
	const { user } = useUser();
	const {
		register,
		watch,
		reset,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormValues>({
		defaultValues: { checkbox: is2faEnable}
	});

	const checkboxValue = watch('checkbox');

	const toggleTwoFactorAuthentication = async (
		code: number, endpoint: string
	): Promise<boolean> => {
		const body = {
			twoFactorAuthenticationCode: code,
		};
		fetch(`http://localhost:4000/auth/2fa/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies['jwt'],
			},
			body: JSON.stringify(body)
		}).then((res) => {
			if (res.ok) 
				return true;
			else 
				throw new Error(res.statusText);
				
		}).catch((e) => {
			if (e.message === 'Unauthorized') {
				setError('tfaCode', {
					type: 'server',
					message: 'Invalid code',
				});
			} else {
				setError('tfaCode', {
					type: 'server',
					message: 'Something went wrong while setting 2FA',
				});
			}
		});
		return false;
	};

	const getQRCode = async () => {
		const response = await fetch('http://localhost:4000/auth/2fa/generate',
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + cookies['jwt'],
				},
			});

		if (response.ok) {
			const responseJSON = await response.json();
			setQrCode(responseJSON);
		}
	};

	useEffect(() => {
		const handleClick = async () => {
			if (checkboxValue) {
				setIsPromptDisplayed(!is2faEnable);
				if (!is2faEnable)
					await getQRCode();
			} else {
				setIsPromptDisplayed(is2faEnable);
				setQrCode(null);
			}
		};
		handleClick();
	}, [checkboxValue]);

	useEffect(() => {
		if (!user) return;
		const fetchUserInfos = async () => {
			fetch(`http://localhost:4000/users/${user?.name}`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + cookies['jwt'],
				},
			}).then((res) => {
				return res.json();
			}).then((res) => {
				setIs2faEnable(res.twoFAEnabled);
				reset({ checkbox: res.twoFAEnabled});
				setIsPromptDisplayed(false);
				setQrCode(null);
				setIsLoading(false);
			});
		};

		fetchUserInfos();
	}, [user, reset]);

	const onSubmit = async (data: any) => {
		const isSuccess = await toggleTwoFactorAuthentication(
			data.tfaCode, is2faEnable ? 'turn-off' : 'turn-on'
		);
		if (isSuccess) {
			setIs2faEnable(!is2faEnable);
			setIsPromptDisplayed(false);
			setQrCode(null);
		}
	};

	if (isLoading) {
		return (
			<p>Loading...</p>
		);
	}

	return (
		<form id='2faForm'
			className={styles.formContainer}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className={styles.formSection}>
				<div className={styles.formSection}>
					<FormLabel content='Two factor authentication' />
					<input type="checkbox"
						id="checkbox"
						{...register('checkbox')}
					/>
					{(qrCode !== null && !is2faEnable && checkboxValue) && 
						<Image
							width={200}
							height={200}
							src={qrCode}
							alt='2fa qrcode'
						/>}
				</div>
				{isPromptDisplayed &&
					<div className={styles.labeledInput_container}>
						<input
							className={`
							${styles.input}
							${errors.tfaCode ? styles.input_error : ''}
						`}
							type='text'
							placeholder='2FA Code'
							{...register('tfaCode', {
								maxLength: {
									value: 6,
									message: 'Code should be 6 numbers'
								},
								pattern: {
									value: /^[0-9]*$/,
									message: 'Invalid Input. Only use numbers (0-9)'
								}
							})}
						/>
						<span className={
							errors.tfaCode ?
								styles.error_message : styles.error_message_invisible
						}
						>{errors.tfaCode && errors.tfaCode.message}</span>
					</div>
				}
			</div>
		</form>
	);
}