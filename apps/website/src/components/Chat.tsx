import chatStyle from "@/styles/chat.module.css"
import Button from "@/components/Button.tsx"
import Tab from "@/components/Tab.tsx"
import Contact from "@/components/Contact.tsx"
import {ServerToClientEvents, ClientToServerEvents, Message} from "../pages/api/socket.types.tsx"
import { KeyboardEvent } from "react";

//chat logic
import {io, Socket} from "socket.io-client";
import { useState, useEffect } from "react";

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export default function Chat()
{
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it

    socket = io("http://localhost:4000", 
		{
			transports: ['websocket', 'polling'],
			methods: ["GET", "POST"],
			allowedHeaders:["Access-Control-Allow-Origin: http://www.localhost"]
		});

		socket.on("message", (msg: Message) => {
  	    setMessages((currentMsg) => [
  	      ...currentMsg,
  	      { author: msg.author, message: msg.message },
  	    ]);

		});

//    socket.on("newIncomingMessage", (msg) => {
//			console.log("on newIncomingMessage");
//      setMessages((currentMsg) => [
//        ...currentMsg,
//        { author: msg.author, message: msg.message },
//      ]);
//      console.log(messages);
//    });
		socket.on("connect_error", (error) => {
			console.log(error);
		});
  };

	const sendMessage = async () => {
		socket.emit("createdMessage", { author: chosenUsername, message });
		console.log("emit createdMessage");
		setMessages((currentMsg) => [
			...currentMsg,
			{ author: chosenUsername, message },
		]);
		setMessage("");
	};

	const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
		//it triggers by pressing the enter key
		if (e.keyCode === 13) {
			if (message) {
				sendMessage();
			}
		}
	};


	return (
		<>
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
								{messages.map((msg, i) => {
								  return (
									<Contact key={i} name="M.Obama" picture="temp" content={msg.message} context="message"/>
								  );
								})
								}
					</div>
					<input 
						type="text"
						placeholder="New Message..." 
						value={message} 
						className={chatStyle.input} 
						onChange={(e) => setMessage(e.target.value)} 
						onKeyUp={handleKeypress}
					>
					</input>
			</div>
		</>
	);
}
