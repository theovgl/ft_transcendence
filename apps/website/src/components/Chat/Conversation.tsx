import { Socket } from 'socket.io-client';
import styles from './Conversation.module.scss';

interface ConversationProps {
	messages: Message[];
	socket?: Socket | null;
}

export default function Conversation(props: ConversationProps) {
	const { messages } = props;

	return (
		<div className={styles.conversation_container}>
			<div className={styles.messages_container}>
				{/* {messages.map((message, i) => (
					// <Message
					// 	key={i}
					// 	content={message}
					// 	username={}
					// 	room={}
					// 	isUserAdmin={}
					// />
				))} */}
			</div>
			<div>
				
			</div>
		</div>
	);
}