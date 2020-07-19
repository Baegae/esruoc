import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-grid-system';

import * as firebase from 'firebase';

import * as S from './styles';
import axiosInstance, {deleteAccessToken, getUserInfo} from '@src/utils/ApiRequest';

const Navbar: React.FC = () => {
  const [loginLabel, setLoginLabel] = useState('로그인');

  const loginOrLogout = () => {
    if (loginLabel === '로그인') {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        firebase.auth().currentUser!.getIdToken(true).then((idToken) => {
          axiosInstance.post('/user/login', {
            googleAccessToken: idToken
          }).then((result) => {
            console.log(result);
          });
        }).catch((error) => {
          alert('로그인을 실패했습니다.');
          console.error(error);
        });
      }).catch((error) => {
        alert('로그인을 실패했습니다.');
        console.error(error);
      });
    } else {
      const logoutConfirmDialog = confirm('로그아웃 할까요?');

      if (logoutConfirmDialog) {
        deleteAccessToken();
      }
    }
  };

  const isLoggedIn = (): boolean => {
    return !!getUserInfo();
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
