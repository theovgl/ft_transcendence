import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ballImg from './img/Ball.png';

const BASE_VELOCITY = 0.3;
const MAX_VELOCITY = 2;
const BOUNCE_ACCELERATION = 1.1;
const WIDTH_OFFSET = 5;
const HEIGHT_OFFSET = 5;

const Ball = (props) => {
	const [position, setPosition] = useState({
		x: props.gameBounds.width / 2,
		y: props.gameBounds.height / 2
	});
	const [percentagePos, setPercentagePos] = useState({
		x: (position.x / props.gameBounds.width) * 100,
		y: (position.y / props.gameBounds.height) * 100
	});
	const [velocity, setVelocity] = useState({
		x: BASE_VELOCITY,
		y: BASE_VELOCITY
	});
	const [bounds, setBounds] = useState({x: 0, y:0, width: 0, height: 0});
	const [gamebounds, setGameBounds] = useState({
		x: props.gameBounds.x,
		y: props.gameBounds.y,
		width: props.gameBounds.width,
		height: props.gameBounds.height
	});
	const [isColliding, setIsColliding] = useState(false);
	const [initialSize] = useState({
		width: props.gameBounds.width,
		height: props.gameBounds.height
	});
	const ballRef = useRef(null);

	// Resize Hitboxes
	useEffect(() => {
		const calculateHitBox = () => {
			if (ballRef.current) {
				const { left, top, width, height } = ballRef.current.getBoundingClientRect();
				setBounds({ x: left, y: top, width: width, height: height });
			}
			setPosition({
				x : (percentagePos.x / 100) * props.gameBounds.width,
				y : (percentagePos.y / 100) * props.gameBounds.height
			});
			const { x, y, width, height } = props.gameBounds;
			setGameBounds({x: x, y: y, width: width, height: height});
		};

		if (JSON.stringify(props.gameBounds) !== JSON.stringify(gamebounds))
			calculateHitBox();

	}, [ballRef, percentagePos.x, percentagePos.y, props.gameBounds, gamebounds]);

	// Ball movement online mode
	useEffect(() => {
		if (props.socket !== null) {
			props.socket.on('ball-moved', (pos) => {
				setPercentagePos({
					x: pos.x,
					y: pos.y,
				});
			});
			props.socket.on('goal-scored-j2', () => {
				const currValue = parseInt(props.scoreRight.current.innerText);
				props.scoreRight.current.innerText = currValue + 1 < 10 ? '0' + (currValue + 1) : currValue + 1;
			});
			props.socket.on('goal-scored-j1', () => {
				const currValue = parseInt(props.scoreLeft.current.innerText);
				props.scoreLeft.current.innerText = currValue + 1 < 10 ? '0' + (currValue + 1) : currValue + 1;
			});
		}
		return () => {
			if (props.socket  !== null) {
				props.socket.off('ball-moved');
				props.socket.off('goal-scored-j2');
				props.socket.off('goal-scored-j1');
			}
		};
	}, [props.socket, props.scoreRight, props.scoreLeft]);

	// Ball movement local mode
	useEffect(() => {
		if (props.socket === null) {
			let intervalId = setInterval(() => {
				if (props.managerRef.current && props.managerRef.current.innerText === '') {
					let widthRatio = gamebounds.width / initialSize.width;
					let heightRatio = gamebounds.height / initialSize.height;
					let ratio = (widthRatio + heightRatio) / 2;
					setPosition((prevPosition) => ({
						x: prevPosition.x + (velocity.x * (gamebounds.width / gamebounds.height) * ratio),
						y: prevPosition.y + (velocity.y * (gamebounds.width / gamebounds.height) * ratio)
					}));
				}
			}, 4);
			return () => clearInterval(intervalId);
		}
	}, [velocity, props.managerRef, props.socket,
		initialSize.height, initialSize.width, gamebounds.width, gamebounds.height]);

	// Hitboxes local mode
	useEffect(() => {
		if (props.socket === null) {
			let offset = {
				left : (WIDTH_OFFSET / 100) * gamebounds.width,
				right : (WIDTH_OFFSET / 100) * gamebounds.width,
				top : ((HEIGHT_OFFSET - 2) / 100) * gamebounds.height,
				bottom : ((HEIGHT_OFFSET + 2) / 100) * gamebounds.height
			};
			if (position.x <= 0 - offset.left || position.x + bounds.width >= gamebounds.width) {
				setVelocity((prevVelocity) => ({
					x: prevVelocity.x < 0 ? -BASE_VELOCITY : BASE_VELOCITY,
					y: BASE_VELOCITY
				}));
				setPosition(() => ({
					x : gamebounds.width / 2,
					y: gamebounds.height / 2
				}));
				if (position.x <= 0) {
					const currValue = parseInt(props.scoreRight.current.innerText);
					props.scoreRight.current.innerText = currValue + 1 < 10 ? '0' + (currValue + 1) : currValue + 1;
				} else {
					const currValue = parseInt(props.scoreLeft.current.innerText);
					props.scoreLeft.current.innerText = currValue + 1 < 10 ? '0' + (currValue + 1) : currValue + 1;
				}
			}
			if (position.y <= 0 + offset.top || position.y + bounds.height >= gamebounds.height - offset.bottom) {
				if (!isColliding) {
					setIsColliding(true);
					setVelocity((prevVelocity) => ({
						x: prevVelocity.x,
						y: -prevVelocity.y
					}));
				} else
					setIsColliding(false);

			}
		}
		const ballRect = ballRef.current.getBoundingClientRect();

		const checkCollision = (ballRect, characterRect) => {
			if (ballRect.x > characterRect.x - characterRect.width &&
				ballRect.x < characterRect.x + characterRect.width &&
				ballRect.y > characterRect.y &&
				ballRect.y < characterRect.y + characterRect.height
			)
				return (true);
			return (false);
		};

		const collisionPhysic = (ballRect, characterRect, ref) => {
			if (ref.current && checkCollision(ballRect, characterRect)) {
				if (!isColliding) {
					setIsColliding(true);
					setVelocity((prevVelocity) => ({
						x: -(prevVelocity.x < 0 ? (Math.max(prevVelocity.x * BOUNCE_ACCELERATION, -MAX_VELOCITY)) :
							Math.min(prevVelocity.x * BOUNCE_ACCELERATION, MAX_VELOCITY)),
						y: prevVelocity.y
					}));
				}
				return true;
			} else
				return false;

		};

		//const rects = [];
		const playerRect = props.playerRef.current && props.playerRef.current.getBoundingClientRect();
		const opponentRect = props.opponentRef.current && props.opponentRef.current.getBoundingClientRect();
		playerRect.x += playerRect.width - (playerRect.width / 2);
		playerRect.width /= 2;
		opponentRect.width /= 2;

		if (!collisionPhysic(ballRect, playerRect, props.playerRef) &&
			!collisionPhysic(ballRect, opponentRect, props.opponentRef))
			setIsColliding(false);

		// if ((props.playerRef.current && checkCollision(ballRect, playerRect)) ||
		//   (props.opponentRef.current && checkCollision(ballRect, opponentRect))) {
		//   if (!isColliding) {
		//     setIsColliding(true);
		//     setVelocity((prevVelocity) => ({
		//         x: -(prevVelocity.x < 0 ? (Math.max(prevVelocity.x * BOUNCE_ACCELERATION, -MAX_VELOCITY)) :
		//             Math.min(prevVelocity.x * BOUNCE_ACCELERATION, MAX_VELOCITY)),
		//         y: prevVelocity.y
		//     }));
		//   }
		// } else {
		//   setIsColliding(false);
		// }
	}, [position, props.playerRef, props.opponentRef, props.scoreLeft, props.scoreRight,
		gamebounds.height, gamebounds.width, gamebounds.x, gamebounds.y, bounds.height, bounds.width, isColliding, props.socket]);

	// Set Responsive position
	useEffect(() => {
		setPercentagePos({
			x : (position.x / gamebounds.width) * 100,
			y : (position.y / gamebounds.height) * 100
		});
	}, [position.x, position.y, gamebounds.width, gamebounds.height]);

	return (
		<BallDiv ref={ballRef} x={percentagePos.x} y={percentagePos.y}>
			<BallDivImg src={ballImg.src}></BallDivImg>
		</BallDiv>
	);
};

const BallDivImg = styled.img`
width: 100%;
height: 100%;
`;

const BallDiv = styled.div.attrs(props => ({
	style: {
		width: '4%',
		height: '5%',
		left: `${props.x}%`,
		top: `${props.y}%`,
	}
}))`
position: absolute;
`;

export default Ball;
