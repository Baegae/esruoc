import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import * as S from './styles';

const Navbar: React.FC = () => {
  return (
    <Container fluid>
      <S.NavbarWrapper>
        <Row justify="between">
          <Col>
            <S.Logo />
          </Col>
          <Col>
            <S.MenuWrapper>
              <li>아직없어</li>
              <li>아직없어</li>
              <li>아직없어</li>
            </S.MenuWrapper>
          </Col>
        </Row>
      </S.NavbarWrapper>
    </Container>
  );
};

export default Navbar;
