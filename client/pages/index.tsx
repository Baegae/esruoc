import React from 'react';
import styled from 'styled-components';
import {Col, Container, Row} from 'react-grid-system';

import Illustration from '@src/assets/illustration.svg';
import Logo from '@src/assets/logo.svg';
import CTAButton from '@src/components/common/CTAButton';

const HomeContainer = styled(Container)`
  position: absolute !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Center = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const IllustImage = styled(Illustration)`
  width: 200%;
  position: relative;
  right: calc(100% - 50px);
`;

const LogoImage = styled(Logo)`
  width: 60%;
`;

const AlignLeftContainer = styled.div`
  margin-left: 75px;
`;

const Title = styled.p`
  font-size: 1.5rem;
  color: rgba(51, 58, 61, 0.55);
  letter-spacing: -0.8px;
`;

const LoginButton = styled(CTAButton)`
  margin-top: 82px;
  flex: 0 0 auto;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Row>
        <Col md={6}>
          <Center>
            <IllustImage />
          </Center>
        </Col>
        <Col md={6}>
          <Center>
            <LogoImage />
            <AlignLeftContainer>
              <Title>새로운 방식으로 바꿀 시간입니다.</Title>
              <Title>나만의 코스를 만들어보세요.</Title>
              <div>
                <LoginButton>로그인하기</LoginButton>
              </div>
            </AlignLeftContainer>
          </Center>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default Home;
