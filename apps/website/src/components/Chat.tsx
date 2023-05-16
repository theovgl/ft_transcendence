import chatStyle from "@/styles/chat.module.css";
import Button from "@/components/Button.tsx";
import Tab from "@/components/Tab.tsx";
import Contact from "@/components/Contact.tsx";
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";


type Message = {
  author: string;
  message: string;
};

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

export default function Chat()
{
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

	socket = io( "http://localhost:4000");

	useEffect(() => {
    socketInitializer();
  }, []);


	const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it



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
		{ author: chosenUsername, message },
	]);
	setMessage("");
};	

const handleKeypress = (e:any) => {
//it triggers by pressing the enter key
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
