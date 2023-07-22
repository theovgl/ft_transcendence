import { TabItem } from './Chat';
import styles from './ConversationList.module.scss';

interface ConversationListProps {
	conversations: TabItem[];
}

export default function ConversationList(props: ConversationListProps) {
	const { conversations } = props;

	return (
		<div className={styles.conversationList_container}>
			{conversations.map((conversation, i) => (
				<div
					key={i}
					className={styles.conversationList_item}
					onClick={conversation.onClick}
				>
					<span
						className={styles.conversationList_label}
					>
						{conversation.label}
					</span>
				</div>
			))}
		</div>
	);
}