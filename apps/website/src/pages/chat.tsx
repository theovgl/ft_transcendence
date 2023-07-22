import Head from 'next/head';
import Chat from '@/components/Chat/Chat';
import Navbar from '@/components/Navbar';

export default function ChatPage() {
	return (
		<>
			<Head>
				<title>Transcendence - Chat</title>
			</Head>
			<Navbar />
			<Chat/>
		</>
	);
}
