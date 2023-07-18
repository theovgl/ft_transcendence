import styled from 'styled-components';
import GameModeManager from "../components/Game/GameModeManager";
import FieldImg from '../components/Game/img/Field.png';
import React from 'react';
import Navbar from '@/components/Navbar';

const GAME_WIDTH = 991;
const GAME_HEIGHT = 678;

export default function Game(props: any) {
  return (
    <>
      <Navbar />
 
      <GameDiv>
          <GameModeManager height={GAME_HEIGHT} width={GAME_WIDTH}/>
          <GameBoardImg src={FieldImg.src}></GameBoardImg>
      </GameDiv>

    </>
    
  )
  
}

const GameBoardImg = styled.img`
    width: 100%;
    height: auto;
`;


const GameDiv = styled.div`
  display: flex;
  position: absolute;
  top: 15%;
  left: 20%;
  width: 60%;
  justify-content: center;
`;
