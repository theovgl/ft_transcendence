import homepageStyle from "@/styles/homepage.module.css"
import Button from "@/components/Button.tsx"

export interface ILeaderboard
{
	current_page: string,
}


export default function Leaderboard(option: ILeaderboard)
{
	return (
		<div className={homepageStyle.leaderboard}>
		</div>
	);
}
