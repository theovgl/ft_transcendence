<<<<<<< HEAD
import '../styles/general.styles.css'
import type { AppProps } from 'next/app'
=======
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/utils/contexts/AuthContext';
import '../styles/general.scss';
>>>>>>> dev

export default function App({ Component, pageProps }: AppProps) {

	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}
