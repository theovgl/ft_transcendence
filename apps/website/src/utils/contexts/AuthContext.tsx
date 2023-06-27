import { createContext } from 'react';
import { User } from '../hooks/useUser';

interface IAuthContext {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
	user: null,
	setUser: () => {},
});