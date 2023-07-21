import type { AppProps } from 'next/app';
import { AuthProvider } from '@/utils/contexts/AuthContext';
import '../styles/general.scss';
import PrivateRoute from '@/components/privateRoute';
import { io } from 'socket.io-client';

export default function App({ Component, pageProps }: AppProps) {

	const protectedRoutes = ['/user/[username]', '/game', '/chat', '/'];
	return (
		<AuthProvider>
			<PrivateRoute protectedRoutes={protectedRoutes}>
				<Component {...pageProps} />
			</PrivateRoute>
		</AuthProvider>
	);
}
