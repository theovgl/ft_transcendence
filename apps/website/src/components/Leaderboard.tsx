import homepageStyle from "@/styles/homepage.module.css"
import leaderboardStyle from "@/styles/leaderboard.module.css"
import Button from "@/components/Button.tsx"


export default function Leaderboard()
{
	return (
		<div className={leaderboardStyle.grid}>
			<h1>Leaderboard</h1>
				<div className={leaderboardStyle.main}>
					
				</div>
				<div className={leaderboardStyle.button_left_grid}> <Button style={leaderboardStyle.button_left}/></div>
				<div className={leaderboardStyle.button_right_grid}><Button style={leaderboardStyle.button_right}/></div>
				<div className={leaderboardStyle.footer}>
					page1/23	
				</div>
		</div>
	);
}
