// This hook will allow us to easily store and retrieve data from localStorage.
export const useLocalStorage = () => {
	const setItem = (key: string, value: string) => {
		localStorage.setItem(key, value);
	};

	const getItem = (key: string) => {
		return localStorage.getItem(key);
	};

	const removeItem = (key: string) => {
		localStorage.removeItem(key);
	};

	return { setItem, getItem, removeItem };
};
