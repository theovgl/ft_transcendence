import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  authToken: string;
}

// This hook will store the user in our context and localStorage.
export const useUser = () => {
	const [user, setUser] = useState<User | null>(null);
	const { setItem, getItem, removeItem } = useLocalStorage();

	useEffect(() => {
		const userItem: string | null = getItem('user');

		if (userItem) {
			const user: User | null = JSON.parse(userItem);
			
			if (user)
				setUser(user);
		}
	}, []);

	const addUser = (user: User) => {
		setUser(user);
		setItem('user', JSON.stringify(user));
	};

	const removeUser = () => {
		setUser(null);
		removeItem('user');
	};
	return { user, addUser, removeUser };
};