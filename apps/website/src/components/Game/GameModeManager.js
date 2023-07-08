import styled from 'styled-components'
import GameBox from './GameBox';
import MultiplayerManager from './MultiplayerManager';
import { useEffect, useState } from 'react';

const LOCAL_OPPONENT_POS_X = 860;
const LOCAL_OPPONENT_POS_Y = 200;

const PLAYERMODE = 2;
const OPPONENTMODE = 1;

const GameModeManager = (props) => {
    const [clicked, setClicked] = useState(false);
    const [mode, setMode] = useState("");

    const onClickButton = (button) => {
        setClicked(() =>{return true});
        setMode(button);
    }
    
    useEffect(() =>{
        console.log("Render GameModeManager");

    });

    const handleQuit = () => {
        console.log("Quit");
        setClicked(() => {return false});
        setMode("");
    }

    return (
        <GameModeManagerDiv height={props.height} width={props.width} disabled={clicked}>
            <ButtonSpecial onClick={() => onClickButton("Special")} disabled={clicked}>Special</ButtonSpecial>
            <ButtonOnline onClick={() => onClickButton("Online")} disabled={clicked}>Online</ButtonOnline>
        { clicked ?
            (mode === "Special" ?
            <MultiplayerManager height={props.height} width={props.width} quitEvent={handleQuit} mode={"Special"}></MultiplayerManager>
            : <MultiplayerManager height={props.height} width={props.width} quitEvent={handleQuit} mode={"Normal"}></MultiplayerManager>)
            : ""
        }
        </GameModeManagerDiv>
    )
}

const ButtonSpecial = styled.button`
    position: absolute;
    border-radius: 25%;
    top: 33%;
    left: 15%;
    width: 20%;
    height: 30%;
    font-size:3vw;
    text-align: center;
    background-color: white;
    color: red;

    /* apply opacity when button is disabled */
    opacity: ${(props) => (props.disabled ? "0" : "1")};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const ButtonOnline = styled.button`
    position: absolute;
    border-radius: 25%;
    width: 20%;
    height: 30%;
    font-size:3vw;
    text-align: center;
    background-color: white;
    top: 33%;
    left: 66%;
    color: red;

    opacity: ${(props) => (props.disabled ? "0" : "1")};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const GameModeManagerDiv = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
`;


export default GameModeManager;