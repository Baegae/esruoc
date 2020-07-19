import React from 'react';
import styled from 'styled-components';
import {Container} from 'react-grid-system';


const TestHeader = styled.h1`
  color: ${({theme}) => theme.colors.text.default};
`;

const TestCaption = styled.p`
  color: ${({theme}) => theme.colors.text.caption};
`;

const TestPrimaryColor = styled.div`
  background: ${({theme}) => theme.colors.primary};
  width: 64px;
  height: 64px;
`;

const TestAccentColor = styled.div`
  background: ${({theme}) => theme.colors.accent};
  width: 64px;
  height: 64px;
`;

const Home: React.FC = () => {
  return (
    <Container>
      <TestHeader>안녕하세여여어어어ㅓ</TestHeader>
      <TestCaption>너무 반갑다는 뜻;;</TestCaption>
      <TestPrimaryColor />
      <TestAccentColor />
    </Container>
  );
};

export default Home;
