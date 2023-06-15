import chatStyle from "@/styles/chat.module.css";
import Tab from "@/components/Tab.tsx";
import Contact from "@/components/Contact.tsx";
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';


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
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}


let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
socket = io( "http://localhost:4000" );

export default function Chat()
{
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("mtogbe");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<String>>([]);
  const [room, setRoom] = useState("");

	let tabList = [	
					{
						label:"General",
						active:true
					},
					{
						label:"Contact 1",
						active:false
					}
	];

	useEffect(() => {
    	socketInitializer();
		return () => {
			socket.off('msgToClient');
		  };
  	}, []);

	const socketInitializer = async () => {
    socket.on("msgToClient", (msg: Message) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message, channel: 'general' },
      ]);
      console.log(messages);
    });
	};

	const sendMessage = async () => {
		socket.emit("msgToServer", { author: chosenUsername, message: message, channel: 'general' });
		setMessages((currentMsg) => [
			...currentMsg,
		]);
		setMessage("");
	};	

	const handleKeypress = (e:any) => {
		if (e.keyCode === 13) {
			if (message) {
				sendMessage();
			}
		}
	}

	return (
		<div className={chatStyle.grid}>

				<div className={chatStyle.tab_list}>	
				{tabList.map(item =>  <Tab key={item.label} label={item.label} active={item.active}/>)}
				</div>

				<div className={chatStyle.contact_list}>
					<Contact name="M.Obama" picture="temp" content="in-game" context="presentation"/>
					<Contact name="XxX_Obama_Gaming_XxX" picture="temp" content="online" context="presentation"/>
					<Contact name="TheRealObama" picture="temp" content="offline" context="presentation"/>
				</div>
				<div className={chatStyle.main}>
				{
					messages.map((msg, i) =>
					{
						return (
							<Contact name="M.Obama" picture="temp" content={msg.message} context="message" key={i}/>
						);
					})
				}
				</div>
				<input type="text" className={chatStyle.input}
				        placeholder="New message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeypress}
				>
				</input>
		</div>
	);
}
