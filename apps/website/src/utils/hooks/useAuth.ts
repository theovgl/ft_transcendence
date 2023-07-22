import { useEffect } from 'react';
import { User, useUser } from './useUser';
import { Cookies } from 'react-cookie';
import { atom, useAtom } from 'jotai';

export const isAuthenticatedAtom = atom<boolean>(false);
const isLoadingAtom = atom<boolean>(true);

export const useAuth = () => {
	const { addUser, removeUser, user } = useUser();
	const jwtCookie = new Cookies('jwt');
	const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
	const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

	useEffect(() => {
		setIsAuthenticated(user ? true : false);
		setIsLoading(false);
	}, [user]);

	const login = (newUser: User) => {
		addUser(newUser);
	};

	const logout = () => {
		setIsAuthenticated(false);
		removeUser();
		jwtCookie.remove('jwt');
	};

	return { login, logout, isLoading, setIsLoading, user, isAuthenticated };
};
