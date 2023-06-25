import type { AppProps } from 'next/app';
import { useAuth } from '@/utils/hooks/useAuth';
import { AuthContext } from '@/utils/contexts/AuthContext';
import '../styles/general.scss';

export default function App({ Component, pageProps }: AppProps) {
	const { user, login, logout, setUser} = useAuth();

	return (
		<AuthContext.Provider value={{user, setUser}}>
			<Component {...pageProps} />
		</AuthContext.Provider>
	);
}
