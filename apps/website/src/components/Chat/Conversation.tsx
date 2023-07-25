import { useUser } from '@/utils/hooks/useUser';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ImExit } from 'react-icons/im';
import { Socket } from 'socket.io-client';
import Message from '../Message/Message';
import { MessageType } from './Chat';
import styles from './Conversation.module.scss';

interface ConversationProps {
	messages: MessageType[];
	isAdmin: boolean;
	room: string;
	sendMessage: (message: MessageType) => void;
	socket?: Socket | null;
}

interface UseFormInputs {
	message: string;
}

export default function Conversation(props: ConversationProps) {
	const { messages, isAdmin, room, sendMessage, socket } = props;
	const { user } = useUser();
	const {
		register,
		handleSubmit,
		reset
	} = useForm<UseFormInputs>();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const leaveRoom = async (room: String) => {
		socket?.emit('leaveRoom', {
			clientName: user!.name,
			roomName: room
		});
	};

	const onSubmit = (data: any) => {
		const newMessage: MessageType = {
			username: user?.displayName,
			message: data.message,
			author: user!.name,
			channel: room
		};
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
				{room == 'General' ? null :
					<ImExit
						className={styles.conversation_leave}
						onClick={() => leaveRoom(room)}
					/>}
			</div>
			<div className={styles.messages_container}>
				{messages.map((message, i) => (
					<Message
						key={i}
						content={message.message}
						username={message.author}
						displayName={message.username}
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