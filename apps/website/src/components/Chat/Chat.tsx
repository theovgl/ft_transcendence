import { SocketContext } from '@/utils/contexts/SocketContext';
import { useUser } from '@/utils/hooks/useUser';
import { UserInfos } from 'global';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Chat.module.scss';
import Conversation from './Conversation';
import ConversationList from './ConversationList';

export type MessageType = {
	author: string;
	message: string;
	channel: string;
}

interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	msgToClient: (msg: MessageType) => void;
	loadRoom: (payload: string) => void;
	setAdmin: (status: boolean) => void;
	leaveRoomClient: (roomName: string) => void;
}

interface ClientToServerEvents {
	hello: () => void;
	msgToServer: (msg: MessageType) => void;
	ChangeRoomFromClient: (payload: string) => void;
	UserConnection: (payload: string) => void;
	startDm: (requesterName: string, addresseeName: string) => void;
	checkAdmin: (roomName: string) => void;
	leaveRoom: (payload: {clientName: string, roomName: string}) => void;
	sendDm: (payload: string) => void;
}

interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

export type TabItem = {
	label: string;
	active: boolean;
	onClick: (label: any) => any; // Adjust the type of onClick accordingly
};

export default function Chat() {
	const socketContext = useContext(SocketContext);
	const socket = socketContext?.socket;
	const { user } = useUser();
	const [username, setUsername] = useState('');
	const [chosenUsername, setChosenUsername] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Array<MessageType>>([]);
	const [rooms, setRooms] = useState<Array<String>>([]);
	const [room, setRoom] = useState('');
	const router = useRouter();
	const [author, setAuthor] = useState(Object);
	const [isAdmin, setIsAdmin] = useState(false);
	const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
	let [tabList, setTablist] = useState<TabItem[]>([
		// {
		// 	label:"General",
		// 	active:true,
		// 	onClick: () => handleTabClick("General")
		// },
	]);

	const roomRef = useRef(room);
	const tablistRef = useRef(tabList);

	useEffect(() => {
		tablistRef.current = tabList;
	}, [tabList]);

	useEffect(() => {
		roomRef.current = room;
	}, [room]);
	
	function startDm() {
		socket?.emit(
			'startDm',
			`${router.query.requesterName}`,
			`${router.query.addresseeName}`
		);
	}

	useEffect(() => {
		startDm();
	}, [router.query.requesterName, router.query.addresseeName]);
	
	useEffect(() => {
		if (user) {
			setChosenUsername(user.name);
			if (socket) {
				setAuthor(socketInitializer());
				socket.emit('UserConnection', user.name);
				socket.on('loadRoom', (payload: string) => {
					setTablist((currenTablist: TabItem[]) => {
						const isLabelAlreadyExists = tablistRef.current.some(
							(tab: any) => tab.label === payload
						);
						if (isLabelAlreadyExists)
							return [...currenTablist];
						else
							if (tablistRef.current.length === 0) {
								setRoom(payload);
								return [...currenTablist,
									{
										label: payload,
										active: tablistRef.current.length === 0 ? true : false,
										onClick: () => handleTabClick(payload)
									}
								];
							} else {
								return [...currenTablist,
									{
										label: payload, 
										active: tablistRef.current.length === 0 ? true : false,
										onClick: () => handleTabClick(payload)
									}
								];
							}
							
					});
				});
				socket.on('leaveRoomClient', (roomName) => {
					setTablist(() => {
						let newtablist = tablistRef.current.filter(
							(tabItem) => tabItem.label !== roomName
						);
						setMessages([]);
						return newtablist;
					});
					
				});
				socket.on('setAdmin', (isUserAdmin) => {
					setIsAdmin(isUserAdmin);
				});
			}
		}
		return () => {
			socket?.off('msgToClient');
		};
	}, [user, socket]);

	const socketInitializer = async () => {
		socket?.on('msgToClient', (msg: MessageType) => {
			setMessages((currentMsg) => {
				if (msg.channel === roomRef.current) {
					return [
						...currentMsg,
						{
							author: msg.author,
							message: msg.message,
							channel: roomRef.current
						},
					];
				}
				return currentMsg;
			});
		});
		socket?.on('setAdmin', (status) => {
			setIsAdmin(status);
		});
	};

	const sendMessage = async (messageToSend: MessageType) => {
		if (room === '')
			return;
		socket?.emit('msgToServer', {
			author: messageToSend.author,
			message: messageToSend.message,
			channel: messageToSend.channel 
		});
		setMessages((currentMsg) => [
			...currentMsg,
		]);
		setMessage('');
	};	

	const changeRoom = async (newRoom: string) => {
		console.log('newroom is : ' + newRoom);
		setIsAdmin(false);
		setRoom(newRoom);
		setMessages([]);
		socket?.emit('checkAdmin', newRoom);
		socket?.emit('ChangeRoomFromClient', newRoom);
	};

	const handleKeypress = (e:any) => {
		if (e.keyCode === 13) {
			if (message) 
				sendMessage();
		}
	};

	const handleTabClick = (label?: string) => {
		if (!label)
			return false;
		const updatedTabs = tabList.map((tab) => {
			if (tab.label === label) {
				changeRoom(label);
				return { ...tab, active: true };
			}
			return { ...tab, active: false };
		});

		setTablist(updatedTabs);
		return true;
	};

	const CreateConversation = (name: string) => {
		console.log(name);
	};

	return (
		<div className={styles.chat_container}>
			<ConversationList conversations={tabList}/>
			<Conversation
				messages={messages}
				isAdmin={isAdmin}
				room={room}
				sendMessage={sendMessage}
			/>
		</div>
	);

}

// return (
// 	<div className={chatStyle.grid}>

// 		<div className={chatStyle.tab_list}>	
// 			{tabList.map(item =>
// 				(
// 					<Tab key={item.label} label={item.label} active={item.active}
// 						onClick={() => handleTabClick(item.label)} />)
// 			)}
// 		</div>

// 		<div className={chatStyle.contact_list}>
// 			<Contact name="M.Obama" picture="temp" content="in-game" context="presentation"
// 				onClickFunction={() => CreateConversation('M.Obama')}/>
// 			<Contact name="XxX_Obama_Gaming_XxX" picture="temp" content="online" context="presentation"/>
// 			<Contact name="TheRealObama" picture="temp" content="offline" context="presentation"/>
// 		</div>
// 		<div className={chatStyle.main}>
// 			{
// 				messages.map((msg, i) => (
// 					<Message
// 						key={i}
// 						content={msg.message}
// 						username={msg.author}
// 						socket={socket ? socket : null}
// 						room={msg.channel}
// 						isUserAdmin={isAdmin}
// 					/>
// 				))
// 			}
// 		</div>
// 		<input type="text" className={chatStyle.input}
// 			placeholder="New message..."
// 			value={message}
// 			onChange={(e) => setMessage(e.target.value)}
// 			onKeyUp={handleKeypress}
// 		>
// 		</input>
// 		<Button
// 			text='Message'
// 			theme='light'
// 			boxShadow
// 			icon={<BiMessageAltDetail />}
// 			onClick={startDm}
// 		/>
// 	</div>
// );