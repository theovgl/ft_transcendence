import styled from 'styled-components';

const WaitingBox = (props) => {

    return (
        <WaitingBoxDiv height={props.height} width={props.width}>Waiting...</WaitingBoxDiv>
    )
}

const WaitingBoxDiv = styled.div`
    top: 25%;
    left: 15%;
    position: absolute;
    text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
    1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
    font-size:11vw;
`;

export default WaitingBox;