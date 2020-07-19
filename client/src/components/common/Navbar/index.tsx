import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-grid-system';

import * as S from './styles';
import {getUserInfo, isLoggedIn, login, logout} from '@src/utils/Login';

const Navbar: React.FC = () => {
  const [loginLabel, setLoginLabel] = useState('로그인');

  const loginOrLogout = () => {
    if (isLoggedIn()) {
      const logoutConfirm = confirm('로그아웃 할까요?');

      if (logoutConfirm) {
        logout();
      }
    } else {
      login();
    }
  };

  useEffect(() => {
    const loggedInUser = getUserInfo();
    if (loggedInUser) {
      setLoginLabel(loggedInUser.name);
    }
  }, []);

  return (
    <Container fluid>
      <S.NavbarWrapper>
        <Row justify="between">
          <Col>
            <S.Logo />
          </Col>
          <Col>
            <S.MenuWrapper>
              { isLoggedIn() && <li>수강중인 강의</li> }
              { isLoggedIn() && <li>내가만든 강의</li> }
              <li onClick={() => loginOrLogout()}>{loginLabel}</li>
            </S.MenuWrapper>
          </Col>
        </Row>
      </S.NavbarWrapper>
    </Container>
  );
};

export default Navbar;
