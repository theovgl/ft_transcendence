import { useEffect, useState } from 'react';
import { User, useUser } from './useUser';
import { Cookies } from 'react-cookie';

// This react hook will be responsible for checking if the user is logged in or not.
export const useAuth = () => {
	const { addUser, removeUser, user } = useUser();
	const jwtCookie = new Cookies('jwt');
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (user !== null)
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
		jwtCookie.remove('jwt');
	};

	return { login, logout, user, isAuthenticated };
};