import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface User {
	id: string;
	name: string;
	displayName: string;
	email: string;
	profilePic: string;
	authToken: string;
	twoFAEnabled: boolean;
}

// This hook will store the user in our context and localStorage.
export const useUser = () => {
	const [ user, setUser ] = useState<User | null>(null);
	const { setItem, getItem, removeItem } = useLocalStorage();

	useEffect(() => {
		const userItem: string | null = getItem('user');

		if (userItem) {
			const user: User | null = JSON.parse(userItem);
			if (user)
				setUser(user);
		}
	}, [getItem('user')]);

	const addUser = (user: User) => {
		setUser(user);
		setItem('user', JSON.stringify(user));
	};

	const removeUser = () => {
		setUser(null);
		removeItem('user');
	};

	const editUser = (updatedUser: Partial<User>) => {
		if (!user) return;

		const newUser = { ...user, ...updatedUser };
		setUser(newUser);
		setItem('user', JSON.stringify(newUser));
	};

	return { user, addUser, removeUser, editUser };
};