import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import collectibleImg from './img/Collectible.png'

const Collectible = (props) => {
    const [position, setPosition] = useState({
        x: props.gameBounds.width / 2,
        y: props.gameBounds.height / 2
      });
    const [percentagePos, setPercentagePos] = useState({
        x: (position.x / props.gameBounds.width) * 100,
        y: (position.y / props.gameBounds.height) * 100
    })
    const [bounds, setBounds] = useState({x: 0, y:0, width: 0, height: 0});
    const [gamebounds, setGameBounds] = useState({
      x: props.gameBounds.x,
      y: props.gameBounds.y,
      width: props.gameBounds.width,
      height: props.gameBounds.height
    })
    const [activated, setActivated] = useState(false);
    const collectibleRef = useRef(null);

    
    // Resize Hitboxes
    useEffect(() => {
      const calculateHitBox = () => {
        if (collectibleRef.current)
        {
          const { left, top, width, height } = collectibleRef.current.getBoundingClientRect();
          setBounds({ x: left, y: top, width: width, height: height });
        }
        setPosition({
          x : (percentagePos.x / 100) * props.gameBounds.width,
          y : (percentagePos.y / 100) * props.gameBounds.height
        })
        const { x, y, width, height } = props.gameBounds;
        setGameBounds({x: x, y: y, width: width, height: height});
      }

      if (JSON.stringify(props.gameBounds) !== JSON.stringify(gamebounds))
        calculateHitBox();
  
    }, [collectibleRef, percentagePos.x, percentagePos.y, props.gameBounds, gamebounds]);

    // Collectible spawn
    props.socket.on('collectible-spawn', (pos) => {
        setPercentagePos({
          x: pos.x,
          y: pos.y,
        })
        setActivated(true);
    })

    props.socket.on('collectible-touched', () => {
      setActivated(false);
    });


    // Set Responsive position
    useEffect(() => {
        setPercentagePos({
          x : (position.x / gamebounds.width) * 100,
          y : (position.y / gamebounds.height) * 100
        })
    }, [position.x, position.y, gamebounds.width, gamebounds.height])
    
    return (
        <CollectibleDiv ref={collectibleRef} x={percentagePos.x} y={percentagePos.y}
          opacity={activated ? 1 : 0}>
          <CollectibleDivImg src={collectibleImg}></CollectibleDivImg>
          </CollectibleDiv>
    );
}

const CollectibleDivImg = styled.img`
width: 100%;
height: 100%;
`; 

const CollectibleDiv = styled.div.attrs(props => ({
    style: {
        width: `10%`,
        height: `10%`,
        opacity: `${props.opacity}`,
        left: `${props.x}%`,
        top: `${props.y}%`,
    }
    }))`
    position: absolute;
    `;
    
export default Collectible;