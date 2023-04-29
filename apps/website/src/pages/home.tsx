import Head from 'next/head'
import LoginForm from '@/components/Form.tsx'
import formStyle from "@/styles/form.module.css"
import Navigation from "@/components/Navigation.tsx"

export default function Home() {
return (
		<>
			<Navigation current_page="HomePage"/>
		</>
)
}
