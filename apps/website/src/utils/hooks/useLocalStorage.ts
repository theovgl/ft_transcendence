import { useState } from 'react';

// This hook will allow us to easily store and retrieve data from localStorage.
export const useLocalStorage = () => {
	const [value, setValue] = useState<string | null>(null);

	const setItem = (key: string, value: string) => {
		localStorage.setItem(key, value);
		setValue(value);
	};

	const getItem = (key: string) => {
		const value = localStorage.getItem(key);
		setValue(value);
		return value;
	};

	const removeItem = (key: string) => {
		localStorage.removeItem(key);
		setValue(null);
	};

	return { value, setItem, getItem, removeItem };
};