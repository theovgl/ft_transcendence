import styles from './Statistics.module.scss';

interface Props {
	level: number,
	wins: number,
	losses: number,
	winRate: string | number,
}

interface IStatisticsElement {
	title: string,
	value: string | number
}

function StatisticsElement(options: IStatisticsElement) {
	return (
		<div className={styles.stats_element}>
			<h3 className={styles.stats_element_title}>
				{options.title}
			</h3>
			<p className={styles.stats_element_value}>
				{options.value}
			</p>
		</div>
	);
}

export default function Statistics({
	level,
	wins,
	losses,
	winRate
}: Props) {
	return (
		<div className={styles.stats_container}>
			<StatisticsElement title='Level' value={level}/>
			<StatisticsElement title='Wins' value={wins}/>
			<StatisticsElement title='Losses' value={losses}/>
			<StatisticsElement title='W/L Ratio' value={winRate}/>
		</div>
	);
}