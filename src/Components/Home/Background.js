import React from "react";
import styled from "styled-components";

const Background = () => {
  return (
    <Image src="https://cdn.pixabay.com/photo/2016/02/07/21/03/computer-1185626_1280.jpg" />
  );
};

export default Background;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  background-color: black;
`;
