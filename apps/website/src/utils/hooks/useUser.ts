import { useState } from 'react';
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
	const { setItem, removeItem } = useLocalStorage();

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