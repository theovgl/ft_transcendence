import { useEffect, useState } from 'react';
import { User, useUser } from './useUser';

// This react hook will be responsible for checking if the user is logged in or not.
export const useAuth = () => {
	const { addUser, removeUser, user } = useUser();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (user)
			setIsAuthenticated(true);
		else
			setIsAuthenticated(false);
	}, [user]);

	// login
	const login = (newUser: User) => {
		addUser(newUser);
	};

	const logout = () => {
		removeUser();
	};

	return { login, logout, user, isAuthenticated };
};