import Head from 'next/head'
import LoginForm from '@/components/Form.tsx'
import homepageStyle from "@/styles/homepage.module.css"
import Navigation from "@/components/Navigation.tsx"
import Leaderboard from "@/components/Leaderboard.tsx"

export default function Home() {
return (
		<>
				<Navigation current_page="HomePage"/>
				<Leaderboard/>
		</>
)
}
