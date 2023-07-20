import chatStyle from "@/styles/chat.module.css";
import Tab from "@/components/Tab.tsx";
import Contact from "@/components/Contact.tsx";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from 'next/router';
import { useUser } from "@/utils/hooks/useUser";
import { io, Socket } from "socket.io-client";
import Button from '@/components/Button/Button';
import Message from '@/components/Message/Message.tsx';
import { BiMessageAltDetail } from "react-icons/bi";
import { start } from "repl";
import { UserInfos } from "global";
import { useCookies } from 'react-cookie';

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
}

interface ClientToServerEvents {
	hello: () => void;
	msgToServer: (msg: Message) => void;
	ChangeRoomFromClient: (payload: string) => void;
	UserConnection: (payload: string) => void;
	startDm: (requesterName: string, addresseeName: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
socket = io( `http://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000` );

export default function Chat()
{
  const { user } = useUser();
//   const { socket } = useAuth();
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<String>>([]);
  const [room, setRoom] = useState("General");
  const router = useRouter();
  const [cookies] = useCookies();
  const [author, setAuthor] = useState(Object)
  const [userInfo, setUserInfo] = useState<UserInfos | undefined>(undefined);
  
  let [tabList, setTablist] = useState([	
	  {
		  label:"General",
						active:true,
						onClick: () => handleTabClick("General")
					},
					{
						label:"Contact 1",
						active:false,
						onClick: () => handleTabClick("Contact 1")
					}
				]);
				
				const roomRef = useRef(room);
				
				useEffect(() => {
		roomRef.current = room;
	}, [room]);
	
	function startDm() {
		socket.emit('startDm', `${router.query.requesterName}`, `${router.query.addresseeName}`);
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
			}
		}
		// socket.emit('ChangeRoomFromClient', room);
		return () => {
			socket.off('msgToClient');
		};
  	}, [user, socket,]);

	  const socketInitializer = async () => {
		socket.on("msgToClient", (msg: Message) => {
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
	  };

	const sendMessage = async () => {
		socket.emit("msgToServer", { author: chosenUsername, message: message, channel: room });
		setMessages((currentMsg) => [
			...currentMsg,
		]);
		setMessage("");
	};	

	const changeRoom = async (newRoom: string) => {
		console.log("newroom is : " + newRoom);
		setRoom(newRoom);
		setMessages([]);
		socket.emit("ChangeRoomFromClient", newRoom);
	}

	const handleKeypress = (e:any) => {
		if (e.keyCode === 13) {
			if (message) {
				sendMessage();
			}
		}
	}

	const handleTabClick = (label: string) => {
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
			  socket={socket}
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
