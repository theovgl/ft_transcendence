import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const START_TIMER = 3;

const GameManager =  React.forwardRef((props, ref) =>  {
    const [timer, setTimer] = useState(START_TIMER);
    const [forfeit, setForfeit] = useState(false);

    useEffect(() => {
      if (props.socket !== null) {
        props.socket.on('ready-timer', (server_timer) => {
          setTimer(server_timer);
        })
      }
    }, [props.socket])

    useEffect(() => {
      if (props.socket !== null)
      {
        props.socket.on('forfeit', () => {
          setForfeit(true);
          // props.socket.disconnect();
        })
      }
    }, [forfeit, props.socket])
    useEffect(() => {
        let intervalId;
        if (timer > 0)
        {
            if (props.socket === null)
            {
              intervalId = setInterval(() => {
                setTimer(timer - 1);
              }, 1000);
            }
            if (ref.current)
                ref.current.innerText = "Ready \n\t " + timer
        }
        else if (ref.current && !ref.current.innerText.includes("Click to play"))
        {
            intervalId = setInterval(() => {
                if (props.scoreRight.current.innerText === "10")
                    ref.current.innerText = "J2 wins ! \n Click to quit"
                else if (props.scoreLeft.current.innerText === "10")
                    ref.current.innerText = "J1 wins ! \n Click to quit"
                else if (forfeit)
                  ref.current.innerText = "You win ! \n Click to quit"
                else
                    ref.current.innerText = ""
            }, 10);
        }
        return () => clearInterval(intervalId);
      }, [timer, ref, props.scoreLeft, props.scoreRight, forfeit, props.socket]);

      const HandleReplay = () => { 
        if (ref.current.innerText.includes("Click to quit"))
        {
            props.scoreLeft.current.innerText = "00";
            props.scoreRight.current.innerText = "00";
            props.quitEvent();
        }
      }
    
      return (
        <GameManagerDiv onClick={HandleReplay} ref={ref} width={props.width} height={props.height}></GameManagerDiv>
        )

      
})

const GameManagerDiv = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  top: 20%;
  color: red;
  text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
               1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
  font-family: 'Keania One', sans-serif;
  font-size: 10vw;
  position: absolute;
`;

export default GameManager;