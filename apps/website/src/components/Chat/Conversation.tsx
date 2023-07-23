import { useUser } from '@/utils/hooks/useUser';
import { useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Message from '../Message/Message';
import { MessageType } from './Chat';
import styles from './Conversation.module.scss';
import { SocketContext } from '@/utils/contexts/SocketContext';

interface ConversationProps {
	messages: MessageType[];
	isAdmin: boolean;
	room: string;
	sendMessage: (message: MessageType) => void;
}

interface UseFormInputs {
	message: string;
}

export default function Conversation(props: ConversationProps) {
	const { messages, isAdmin, room, sendMessage } = props;
	const { user } = useUser();
	const {
		register,
		handleSubmit,
		reset
	} = useForm<UseFormInputs>();
	const socketContext = useContext(SocketContext);
	const socket = socketContext?.socket;
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const onSubmit = (data: any) => {
		const newMessage: MessageType = {
			message: data.message,
			author: user!.name,
			channel: room
		};
		console.log('Message submit');
		sendMessage(newMessage);
		reset();
	};

	const scrollToBottom = () => {
		if (messagesEndRef.current) 
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className={styles.conversation_container}>
			<div className={styles.conversation_header}>
				<p className={styles.conversation_title}>
					{room}
				</p>
			</div>
			<div className={styles.messages_container}>
				{messages.map((message, i) => (
					<Message
						key={i}
						content={message.message}
						username={message.author}
						room={message.channel}
						socket={socket}
						isUserAdmin={isAdmin}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={styles.message_form}
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