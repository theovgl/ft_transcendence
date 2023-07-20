import { useEffect, useState } from 'react';
import { User, useUser } from './useUser';
import { Cookies } from 'react-cookie';

export const useAuth = () => {
	const { addUser, user } = useUser();
	const jwtCookie = new Cookies('jwt');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsAuthenticated(user ? true : false);
		setIsLoading(false);
	}, [user]);

	const login = (newUser: User) => {
		addUser(newUser);
	};

	const logout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem('user');
		jwtCookie.remove('jwt');
	};

	return { login, logout, isLoading, setIsLoading, user, isAuthenticated };
};
