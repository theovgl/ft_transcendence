import { useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

export interface User {
	id: string;
	name: string;
	displayName: string;
	email: string;
	profilePic: string;
	authToken: string;
}

// const store = createStore();
const userAtom = atomWithStorage<User | null>('user', null);

// This hook will store the user in our context and localStorage.
export const useUser = () => {
	const [user, setUser] = useAtom(userAtom);

	const addUser = (user: User) => {
		setUser(user);
	};

	const removeUser = () => {
		setUser(RESET);
	};

	const editUser = (updatedUser: Partial<User>) => {
		if (!user) return;

		const newUser = { ...user, ...updatedUser };
		setUser(newUser);
	};

	return { user, addUser, removeUser, editUser };
};