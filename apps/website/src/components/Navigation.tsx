import Header from '@/components/Header.tsx'
import Navbar from '@/components/Navbar.tsx'

export interface INavigation
{
	current_page: string,
}

export default function Navigation(option: INavigation)
{
	return (
			<>
				<Header current_page={option.current_page}/>
				<Navbar/>
			</>
	);
}
