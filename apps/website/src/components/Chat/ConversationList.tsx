import { FaPlus } from "react-icons/fa6";
import { TabItem } from './Chat';
import styles from './ConversationList.module.scss';

interface ConversationListProps {
	conversations: TabItem[];
	createRoom: () => void;
}

export default function ConversationList(props: ConversationListProps) {
	const { conversations, createRoom } = props;

	return (
		<div className={styles.conversationList_container}>
			<div className={styles.conversationList_top}>
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
			<div className={styles.conversationList_create} onClick={createRoom}>
				<FaPlus />
			</div>
		</div>
	);
}