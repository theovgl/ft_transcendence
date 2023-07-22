import chatStyle from "@/styles/chat.module.css";
import Tab from "@/components/Tab.tsx";
import Contact from "@/components/Contact.tsx";
import { useState, useEffect, useRef, use, useContext } from "react";
import { useRouter } from 'next/router';
import { useUser } from "@/utils/hooks/useUser";
import { io, Socket } from "socket.io-client";
import Button from '@/components/Button/Button';
import Message from '@/components/Message/Message.tsx';
import { BiMessageAltDetail } from "react-icons/bi";
import { start } from "repl";
import { UserInfos } from "global";
import { useCookies } from 'react-cookie';
import { SocketContext } from "@/utils/contexts/SocketContext";

type Message = {
  author: string;
  message: string;
  channel: string;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
	msgToClient: (msg: Message) => void;
	loadRoom: (payload: string) => void;
	setAdmin: (status: boolean) => void;
	leaveRoomClient: (roomName: string) => void;
}

interface ClientToServerEvents {
	hello: () => void;
	msgToServer: (msg: Message) => void;
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

interface SocketData {
  name: string;
  age: number;
}

type TabItem = {
	label: string;
	active: boolean;
	onClick: (label: string) => boolean; // Adjust the type of onClick accordingly
};



export default function Chat()
{
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const { user } = useUser();
//   const { socket } = useAuth();
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<String>>([]);
  const [room, setRoom] = useState("");
  const router = useRouter();
  const [cookies] = useCookies();
  const [author, setAuthor] = useState(Object);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
  let 	[tabList, setTablist] = useState<TabItem[]>([	
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
	}, [tabList])

	useEffect(() => {
		roomRef.current = room;
	}, [room]);
	
	function startDm() {
		if (typeof router.query.requesterName !== 'undefined' && typeof router.query.addresseeName !== 'undefined')
		socket?.emit('startDm', `${router.query.requesterName}`, `${router.query.addresseeName}`);
	}

	useEffect(() => {
		startDm();
	}, [router.query.requesterName, router.query.addresseeName]);
	
	useEffect(() => {
		if (user)
		{
			setChosenUsername(user.name);
			if (socket)
			{
				setAuthor(socketInitializer());
				socket.emit("UserConnection", user.name);
				socket.on("loadRoom", (payload: string) => {
					setTablist((currenTablist: TabItem[]) => {
						const isLabelAlreadyExists = tablistRef.current.some((tab: any) => tab.label === payload);
						if (isLabelAlreadyExists)
							return [...currenTablist];
						else
							if (tablistRef.current.length === 0)
							{
								setRoom(payload);
								return [...currenTablist,
									{ label: payload, active: tablistRef.current.length === 0 ? true : false, onClick: () => handleTabClick(payload) }
								]
							}
							else {
								return [...currenTablist,
									{ label: payload, active: tablistRef.current.length === 0 ? true : false, onClick: () => handleTabClick(payload) }
								]
							}
							
					})
				})
				socket.on('leaveRoomClient', (roomName) => {
					// if (tablistRef.current.length >= 1){
					// 	console.log('auto change room');
					// 	handleTabClick(tablistRef.current.find((tabItem) => tabItem.label !== roomName)?.label)					
					// }
					// else {
					// 	console.log("newroom is : " + "");
					// 	setIsAdmin(false);
					// 	setRoom("");
					// 	setMessages([]);
					// }
					setTablist(() => {
						let newtablist = tablistRef.current.filter((tabItem) => tabItem.label !== roomName)
						setMessages([]);
						return newtablist
					});
					
				})
				socket.on('setAdmin', (isUserAdmin) => {
					setIsAdmin(isUserAdmin);
				})
			}
		}
		// socket.emit('ChangeRoomFromClient', room);
		return () => {
			socket?.off('msgToClient');
		};
  	}, [user, socket,]);

	  const socketInitializer = async () => {
		socket?.on("msgToClient", (msg: Message) => {
		  setMessages((currentMsg) => {
			if (msg.channel === roomRef.current) {
			  return [
				...currentMsg,
				{ author: msg.author, message: msg.message, channel: roomRef.current },
			  ];
			}
			return currentMsg;
		  });
		});
		socket?.on('setAdmin', (status) => {
			console.log("is Admin: " + status);
			setIsAdmin(status);
		})
	  };

	const sendMessage = async () => {
		if (room === "")
			return;
		socket?.emit("msgToServer", { author: chosenUsername, message: message, channel: room });
		setMessages((currentMsg) => [
			...currentMsg,
		]);
		setMessage("");
	};	

	const changeRoom = async (newRoom: string) => {
		console.log("newroom is : " + newRoom);
		setIsAdmin(false);
		setRoom(newRoom);
		setMessages([]);
		socket?.emit('checkAdmin', newRoom);
		socket?.emit("ChangeRoomFromClient", newRoom);
	}

	const handleKeypress = (e:any) => {
		if (e.keyCode === 13) {
			if (message) {
				sendMessage();
			}
		}
	}

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
	}

	return (
		<div className={chatStyle.grid}>

				<div className={chatStyle.tab_list}>	
				{tabList.map(item =>  
				(
					<Tab key={item.label} label={item.label} active={item.active}
					onClick={() => handleTabClick(item.label)} />)
					)}
				</div>

				<div className={chatStyle.contact_list}>
					<Contact name="M.Obama" picture="temp" content="in-game" context="presentation"
					onClickFunction={() => CreateConversation("M.Obama")}/>
					<Contact name="XxX_Obama_Gaming_XxX" picture="temp" content="online" context="presentation"/>
					<Contact name="TheRealObama" picture="temp" content="offline" context="presentation"/>
				</div>
				<div className={chatStyle.main}>
        {
          messages.map((msg, i) => (
            <Message
              key={i}
              content={msg.message}
              username={msg.author}
			  socket={socket ? socket : null}
			  room={msg.channel}
			  isUserAdmin={isAdmin}
            />
          ))
        }
      </div>
				<input type="text" className={chatStyle.input}
				        placeholder="New message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeypress}
				>
				</input>
<Button
	text='Message'
	theme='light'
	boxShadow
	icon={<BiMessageAltDetail />}
	onClick={startDm}
/>
		</div>
	);
}
