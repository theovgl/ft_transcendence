import type { AppProps } from 'next/app';
import { LoginContext } from '@/utils/contexts/LoginContext';
import '../styles/general.scss';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<LoginContext.Provider value={false}>
			<Component {...pageProps} />
		</LoginContext.Provider>
	);
}
