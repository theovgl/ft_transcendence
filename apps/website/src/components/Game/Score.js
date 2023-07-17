import React from 'react';
import styled from 'styled-components';

const Score = React.forwardRef((props, ref) => {

    return (
        <ScoreDiv ref={ref} left={props.left}>00</ScoreDiv>
    )
})

const ScoreDiv = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  top: 5;
  color: white;
  font-size: 7vw;
  position: absolute;
`;

export default Score;