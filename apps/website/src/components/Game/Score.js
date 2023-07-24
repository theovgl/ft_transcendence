import React from 'react';
import styled from 'styled-components';

const Score = React.forwardRef((props, ref) => {
	// left={props.left}
	return (
		<ScoreDiv ref={ref} y={props.left}>00</ScoreDiv>
	);
});

const ScoreDiv = styled.div`
	position: absolute;
	left: ${(props) => props.y}%;
	top: 5;
	color: white;
	font-size: 7vw;
`;

export default Score;