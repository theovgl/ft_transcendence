import { useEffect, useState, useRef } from 'react';
import GameBox from './GameBox';
import io from 'socket.io-client'
import WaitingBox from './WaitingBox'

const STARTPOS_Y = 200;
const STARTPOS_X = 860;
const ONLINEMODE = 0;
const PLAYERMODE = 2;

const MultiplayerManager = (props) => {
    const [infos, setInfos] = useState({
        opponentX: STARTPOS_X,
        opponentY: STARTPOS_Y,
        userId: Math.floor(Math.random() * 9999) + 1,
        matchFound: false,
        rightPlayer: ONLINEMODE,
        leftPlayer: PLAYERMODE,
        connected: false
    })

    const socketRef = useRef(null);

    // const socket = io('ws://localhost:8000');

    useEffect(() => {
        
        const socket=io.connect("ws://localhost:4000", {
            query: {
                userId: infos.userId,
                mode: props.mode,
                premade: props.premadeId
            }
          })
          socketRef.current = socket;
        
        
        window.addEventListener('beforeunload', () => {
            socket.disconnect();
          });
        
        // Listen to the 'connect' event
        socket.on('connect', () => {
            console.log('Connected to socket.io server');
           // console.log('User Id :' + infos.userId);
            setInfos(prevInfos => ({
              ...prevInfos,
              connected: true,
            }));
        });
        

        //Listen to both p1 and p2 events to determinate on which pos you will be
        socket.on('game-start', (leftPlayer, rightPlayer) => {
          console.log("match found !");
          setInfos(prevInfos => ({
              ...prevInfos,
              matchFound: true,
              rightPlayer: rightPlayer,
              leftPlayer: leftPlayer
            }));
        })

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
        
        // Clean up the event listeners when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', () => {
                socket.disconnect();
              });
           socket.off('connect');
           socket.off('opponentMoved');
           socket.disconnect();
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
}
 
export default MultiplayerManager;