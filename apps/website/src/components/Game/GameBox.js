import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Ball from './Ball';
import Score from './Score';
import Character from './Character.js';
import GameManager from './GameManager';
import Collectible from './Collectible';

const BASE_HEIGHT = 10;

const GameBox = (props) => {
    const playerRef = useRef(null);
    const opponentRef = useRef(null);
    const scoreLeft = useRef(null);
    const scoreRight = useRef(null);
    const managerRef = useRef(null);
   const ref = useRef(null);

    const [bounds, setBounds] = useState({x: 0, y: 0, width: 0, height: 0});
    const [leftPlayer, setLeftPlayer] = useState({x: 5, y: 20, height: BASE_HEIGHT});
    const [rightPlayer, setRightPlayer] = useState({x: 95, y: 20, height: BASE_HEIGHT});
    // useEffect(() => {
    //     if (props.socket !== null)
    //     {
    //         props.socket.on('menu', () => {
    //             props.quitEvent();
    //         })
    //     }
    // }, [managerRef.current]);


    useEffect(() => {
      if (props.socket !== null)
      {
        props.socket.on('collectible-touched-j1', (bonus) => {
          setLeftPlayer((prev) => {
            return {...prev,
            height: bonus + BASE_HEIGHT}
          })
        })
        props.socket.on('collectible-touched-j2', (bonus) => {
          setRightPlayer((prev) => {
            return {...prev,
            height: bonus + BASE_HEIGHT}
          })
        })
        props.socket.on('bonus-ended', () => {
          setRightPlayer((prev) => {
            return {...prev,
            height: BASE_HEIGHT}
          })
          setLeftPlayer((prev) => {
            return {...prev,
            height: BASE_HEIGHT}
          })
        })
      }
    })

    useEffect(() => {
      const calculateHitBox = () => {
        if (ref.current)
        {
          const { left, top, width, height } = ref.current.getBoundingClientRect();
          setBounds({ x: left, y: top, width, height });
          setLeftPlayer((prev) => {
            return {...prev,
              x : (5 / 100) * width,
              y : (20 / 100) * height
            }
          })
          setRightPlayer((prev) => {
            return {...prev,
              x : (95 / 100) * width,
              y : (20 / 100) * height
            }
          })
        }
      }

      const handleResize = () => {
        calculateHitBox();
      }

      calculateHitBox();

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    }, [ref]);

    if (!ref.current)
    {
      return (
        <GameBoxDiv ref={ref} height={30} width={60}/>
      )
    
    }

    return (
            <GameBoxDiv ref={ref} height={30} width={60}>
            <Score ref={scoreLeft} left={20}></Score>
            <Score ref={scoreRight} left={65}></Score>
            <Character id="Player" ref={playerRef} controlMode={props.leftPlayer} x={leftPlayer.x} y={leftPlayer.y} 
            socket={props.socket} gameBounds={bounds} height={leftPlayer.height}/>
            <Character id="Opponent" ref={opponentRef} controlMode={props.rightPlayer}
             x={rightPlayer.x} y={rightPlayer.y} gameBounds={bounds} height={rightPlayer.height}
             socket={props.socket}/>
            <Ball managerRef={managerRef} playerRef={playerRef} opponentRef={opponentRef}
            scoreLeft={scoreLeft} scoreRight={scoreRight} socket={props.socket} gameBounds={bounds}/>
            <Collectible gameBounds={bounds} socket={props.socket}></Collectible>
            <GameManager ref={managerRef} scoreLeft={scoreLeft} scoreRight={scoreRight}
            height={props.height} width={props.width} socket={props.socket} quitEvent={props.quitEvent}
            ></GameManager>
            </GameBoxDiv>
    );
};


const GameBoxDiv = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
`;

export default GameBox;

