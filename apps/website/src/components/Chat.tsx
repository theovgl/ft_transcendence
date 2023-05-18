import chatStyle from "@/styles/chat.module.css";
import Tab from "@/components/Tab.tsx";
import Contact from "@/components/Contact.tsx";
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";


type Message = {
  author: string;
  message: string;
	//channel: string;
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

//const tabs = Array.from(document.getElementsByClassName("ChannelTab"));
//
//tabs.forEach(tab => {
//	tab.addEventListener('click', function SelectChannel()
//	{
//		console.log("test");
//	});
//});


let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
socket = io( "http://localhost:4000" );

export default function Chat()
{
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<String>>([]);
  const [room, setRoom] = useState("");

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
        { author: msg.author, message: msg.message },
      ]);
      console.log(messages);
    });
	};

	const sendMessage = async () => {
		socket.emit("msgToServer", { author: chosenUsername, message });
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
					<Tab label="General" active={true}/>
					<Tab label="Contact 1" active={false}/>
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
