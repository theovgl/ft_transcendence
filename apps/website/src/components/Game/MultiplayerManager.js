import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import GameBox from './GameBox';
import WaitingBox from './WaitingBox';

const STARTPOS_Y = 200;
const STARTPOS_X = 860;
const ONLINEMODE = 0;
const PLAYERMODE = 2;

const MultiplayerManager = (props) => {

	const [infos, setInfos] = useState({
		opponentX: STARTPOS_X,
		opponentY: STARTPOS_Y,
		userId: props.userId,
		matchFound: false,
		rightPlayer: ONLINEMODE,
		leftPlayer: PLAYERMODE,
		connected: false
	});
	const socketRef = useRef(null);

	useEffect(() => {

		const socket = io.connect(`ws://${process.env.NEXT_PUBLIC_IP_ADDRESS}:4000`, {
			query: {
				userId: infos.userId,
				mode: props.mode,
				premade: props.premadeId
			}
		});
		socketRef.current = socket;

		window.addEventListener('beforeunload', () => {
			socket.emit('quit');
			socket.emit('quitGame', infos.userId);
		});

		socket.on('statusinGame', () => {
			socket.emit('inGame', infos.userId);
		});
		// Listen to the 'connect' event
		socket.on('connect', () => {
			socket.emit('addConnectedUser', infos.userId);
			socket.emit('matchmaking', {
				query: {
					userId: infos.userId,
					mode: props.mode,
					premade: props.premadeId
				}
			});
			setInfos(prevInfos => ({
				...prevInfos,
				connected: true,
			}));
		});

		//Listen to both p1 and p2 events to determinate on which pos you will be
		socket.on('game-start', (leftPlayer, rightPlayer) => {
			setInfos(prevInfos => ({
				...prevInfos,
				matchFound: true,
				rightPlayer: rightPlayer,
				leftPlayer: leftPlayer
			}));
		});

		socket.on('connect_error', (error) => {
			console.error('Failed to connect to socket.io server', error);
		});

		// Listen to the 'opponentMoved' event
		socket.on('opponentMoved', (data) => {
			setInfos({
				opponentX: data.x,
				opponentY: data.y,
			});
		});
		socket.on('cancel', () => {
			window.location.reload();
		});
		socket.on('playerQuit', () => {
			socket.disconnect();
		});
		// Clean up the event listeners when the component unmounts
		return () => {
			window.removeEventListener('beforeunload', () => {
				socket.emit('quitGame', infos.userId);
				socket.emit('quit');
			});
			socket.off('connect');
			socket.off('opponentMoved');
			socket.emit('quitGame', infos.userId);
			socket.emit('quit');
		};
	}, [infos.userId]);

	return (
		infos.matchFound === true ? (
			<GameBox height={props.height} width={props.width}
				opponentPosX={infos.opponentX} opponentPosY={infos.opponentY}
				rightPlayer={infos.rightPlayer} leftPlayer={infos.leftPlayer}
				socket={socketRef.current} quitEvent={props.quitEvent}
			/>
		) : (
			<WaitingBox height={props.height} width={props.width} />
		)
	);
};

export default MultiplayerManager;