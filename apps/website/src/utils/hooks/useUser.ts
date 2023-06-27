import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLocalStorage } from './useLocalStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  authToken: string;
}

// This hook will store the user in our context and localStorage.
export const useUser = () => {
	const { user, setUser } = useContext(AuthContext);
	const { setItem } = useLocalStorage();

	const addUser = (user: User) => {
		setUser(user);
		setItem('user', JSON.stringify(user));
	};

	const removeUser = () => {
		setUser(null);
		setItem('user', '');
	};

	return { user, addUser, removeUser };
};