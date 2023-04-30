import Head from 'next/head'
import Navigation from "@/components/Navigation.tsx"
import Button from "@/components/Button.tsx"
import Chat from '@/components/Chat.tsx'

export default function ChatPage() {
return (
		<>
				<Navigation current_page="Chat"/>
				<Chat/>
		</>
)
}
