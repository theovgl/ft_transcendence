import { useForm } from 'react-hook-form';
import { Socket } from 'socket.io-client';
import { MessageType } from './Chat';
import styles from './Conversation.module.scss';

interface ConversationProps {
	messages: MessageType[];
	socket?: Socket | null;
}

interface UseFormInputs {
	message: string;
}

export default function Conversation(props: ConversationProps) {
	const { messages } = props;
	const {
		register,
		handleSubmit,
		reset
	} = useForm<UseFormInputs>();

	const onSubmit = () => {
		console.log('Message submit');
		reset();
	};

	return (
		<div className={styles.conversation_container}>
			<div className={styles.messages_container}>
				<p>hey</p>
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
			<form
				onSubmit={handleSubmit(onSubmit)}
			>
				<input
					placeholder='Type your message...'
					className={styles.message_input}
					{...register('message', { required: true })}
				/>
			</form>
		</div>
	);
}