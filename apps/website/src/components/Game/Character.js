
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import birdImg from './img/Player 1.png';

const ACCELERATION = 5;
const MAX_SPEED = ACCELERATION * 2;
const ONLINEMODE = 0;
const PLAYERMODE = 1;
const OPPONENTMODE = 2;
const HEIGHTOFFSET = 4;

const Character = React.forwardRef((props, ref) => {
    const [characterPosition, setCharacterPosition] = useState({ x: props.x, y: props.y});
    const [characterSpeed, setCharacterSpeed] = useState({ x: 0, y: 0 });
    const [bounds, setBounds] = useState({x: 0, y:0, width: 0, height: 0});
    const [percentagePos, setPercentagePos] = useState({
      x: (characterPosition.x / props.gameBounds.width) * 100,
      y: (characterPosition.y / props.gameBounds.height) * 100});
    const [gamebounds, setGameBounds] = useState({
      x: props.gameBounds.x,
      y: props.gameBounds.y,
      width: props.gameBounds.width,
      height: props.gameBounds.height
    })
    let [isKeyDown, setIsKeyDown] = useState(false);
    

    
//  Resize Hitboxes
    useEffect(() => {
      const calculateHitBox = () => {
        if (ref.current)
        {
          const { left, top, width, height } = ref.current.getBoundingClientRect();
          setBounds({ x: left, y: top, width: width, height: height });
        }
        setCharacterPosition({
          x : (percentagePos.x / 100) * props.gameBounds.width,
          y : (percentagePos.y / 100) * props.gameBounds.height
        })
        const { x, y, width, height } = props.gameBounds;
        setGameBounds({x: x, y: y, width: width, height: height});
      }

      calculateHitBox();
  
    }, [ref, percentagePos.x, percentagePos.y, props.gameBounds]);

//  Controls
    useEffect(() => {
      const handleKeyDown = (event) => {
        setIsKeyDown(true);
        switch (event.key.toLowerCase()) {
          case props.controlMode === PLAYERMODE ? 'arrowup' : 'w':
            setCharacterSpeed((prevSpeed) => ({
              x: prevSpeed.x,
              y: Math.max(prevSpeed.y - ACCELERATION, -MAX_SPEED),
            }));
            break;
          case props.controlMode === PLAYERMODE ? 'arrowup' : 'z':
            setCharacterSpeed((prevSpeed) => ({
              x: prevSpeed.x,
              y: Math.max(prevSpeed.y - ACCELERATION, -MAX_SPEED),
            }));
            break;
          case props.controlMode === PLAYERMODE ? 'arrowdown' : 's':
            setCharacterSpeed((prevSpeed) => ({
              x: prevSpeed.x,
              y: Math.min(prevSpeed.y + ACCELERATION, MAX_SPEED),
            }));
            break;
          default:
            break;
        }
      };
  
      const handleKeyUp = (event) => {
        switch (event.key.toLowerCase()) {
          case props.controlMode === PLAYERMODE ? 'arrowup' : 'w':
            setCharacterSpeed({ x: 0, y: 0 });
            setIsKeyDown(false);
            break;
          case props.controlMode === PLAYERMODE ? 'arrowup' : 'z':
            setCharacterSpeed({ x: 0, y: 0 });
            setIsKeyDown(false);
            break;
          case props.controlMode === PLAYERMODE ? 'arrowdown' : 's':
            setCharacterSpeed({ x: 0, y: 0 });
            setIsKeyDown(false);
            break;
          default:
            break;
        }
      };
      if (props.controlMode === PLAYERMODE || props.controlMode === OPPONENTMODE)
      {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }
    }, [characterPosition, props.controlMode]);
  
//  Player movement (online and offline)
    useEffect(() => {
      if (isKeyDown) {
          const intervalId = setInterval(() => {
            let offset = (HEIGHTOFFSET / 100) * gamebounds.height;
            setCharacterSpeed((prevSpeed) => ({
              x : prevSpeed.x * (gamebounds.width / gamebounds.height),
              y : prevSpeed.y * (gamebounds.width / gamebounds.height)
            }))
            setCharacterPosition((prevPosition) => ({
              x: prevPosition.x + characterSpeed.x,
              y: Math.min(Math.max(prevPosition.y + characterSpeed.y, offset)
              , gamebounds.height - bounds.height - offset)
            }));
            
          }, 16);
          return () => {
            clearInterval(intervalId);
          };
      }
    }, [characterSpeed, isKeyDown, props.socket, characterPosition, props.userId, props.controlMode,
        bounds.height, gamebounds.height, gamebounds.width]);
    
//  Send new position to server
    useEffect(() => {
      if (props.socket !== null && props.controlMode === OPPONENTMODE)
      {
        props.socket.emit("player-moved", {
          userId: props.userId,
          pos: {
            x : (characterPosition.x / gamebounds.width) * 100,
            y : (characterPosition.y / gamebounds.height) * 100
          }
        })
      }
    }, [characterPosition]);

//  Reposition when buff acquired
    useEffect(() => {
      setPercentagePos((prev) =>{
        return {...prev,
        y: prev.y <= 35 ? prev.y : 35}
      })
    }, [props.height])
//  Opponent movement online
    useEffect(() => {
      if (props.controlMode === ONLINEMODE)
      {
        if (props.socket !== null)
        {
          props.socket.on('opponent-moved', (pos) => {
            setPercentagePos({
              x: pos.x,
              y: pos.y,
            })

          })
        }
      }
    }, [props.controlMode, props.socket])


    // useEffect(() => {
    //   if (props.controlMode === ONLINEMODE)
    //   {
    //     if (props.)
    //   }
    // })
//  Responsive position
    useEffect(() => {
      setPercentagePos({
        x : (characterPosition.x / gamebounds.width) * 100,
        y : (characterPosition.y / gamebounds.height) * 100
      });
    }, [characterPosition.x, characterPosition.y, gamebounds.width, gamebounds.height])

    return (
      <CharacterDiv ref={ref} x={percentagePos.x} y={percentagePos.y} height={props.height}>
        <CharacterImg src={birdImg}></CharacterImg>
      </CharacterDiv>
    );
  });
  

  
  const CharacterImg = styled.img`
    width: 100%;
    height: 100%;
  `;

  const CharacterDiv = styled.div.attrs((props) => ({
    style: {
      position: 'absolute',
      backgroundColor: 'red',
      height: `${props.height}%`,
      width: `2%`,
      left: `${props.x}%`,
      top: `${props.y}%`,
    //  borderRadius: '0%',
    },
  }))``;

export default Character;