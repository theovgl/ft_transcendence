import styles from './Statistics.module.scss';

interface Props {
	level: number,
	wins: number,
	looses: number,
	winRate: number,
}

interface IStatisticsElement {
	title: string,
	value: number
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
	looses,
	winRate
}: Props) {
	return (
		<div className={styles.stats_container}>
			<StatisticsElement title='Level' value={level}/>
			<StatisticsElement title='Wins' value={wins}/>
			<StatisticsElement title='Looses' value={looses}/>
			<StatisticsElement title='W/L Ratio' value={winRate}/>
		</div>
	);
}