import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-grid-system';

import * as S from './styles';
import {getUserInfo, isLoggedIn, login, logout} from '@src/utils/Login';
import Router from 'next/router';

const Navbar: React.FC = () => {
  const [loginLabel, setLoginLabel] = useState('로그인');

  const loginOrLogout = () => {
    if (isLoggedIn()) {
      logout();
    } else {
      login();
    }
  };

  const gotoLectureListPage = () => {
    Router.push('/lecture');
  };

  const gotoMyUploadLectureListPage = () => {
    Router.push('/lecture/upload');
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
              { isLoggedIn() && <li onClick={() => gotoLectureListPage()}>수강 중인 강의</li> }
              { isLoggedIn() && <li onClick={() => gotoMyUploadLectureListPage()}>내가 만든 강의</li> }
              <li onClick={() => loginOrLogout()}>{loginLabel}</li>
            </S.MenuWrapper>
          </Col>
        </Row>
      </S.NavbarWrapper>
    </Container>
  );
};

export default Navbar;
