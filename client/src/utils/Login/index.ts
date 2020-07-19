import * as firebase from 'firebase';
import axiosInstance from '@src/utils/ApiRequest';
import jwt_decode from 'jwt-decode';
import {destroyCookie, parseCookies, setCookie} from 'nookies';
import User from '@shared/src/entity/User';


const ACCESS_TOKEN_STORE_KEY = 'esruoc-access-token';

export const login = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((_) => {
      firebase.auth().currentUser!.getIdToken(true).then((idToken) => {
        axiosInstance.post('/user/login', {
          googleAccessToken: idToken
        }).then((result) => {
          console.log(result);
        }).catch((_) => {
          alert('로그인을 실패했습니다.');
        });
      }).catch((error) => {
        alert('로그인을 실패했습니다.');
        console.error(error);
      });
  }).catch((error) => {
    alert('로그인을 실패했습니다.');
    console.error(error);
  });
};

export const logout = () => {
  const logoutConfirmDialog = confirm('로그아웃 할까요?');

  if (logoutConfirmDialog) {
    deleteAccessToken();
  }
};

export const isLoggedIn = (): boolean => {
  return !!getUserInfo();
};

export const setAccessToken = (accessToken: string) => {
  try {
    jwt_decode(accessToken);

    setCookie(null, ACCESS_TOKEN_STORE_KEY, accessToken, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
  } catch (e) {
    console.log(e);
  }

  gotoMain();
};

export const deleteAccessToken = () => {
  destroyCookie(null, ACCESS_TOKEN_STORE_KEY, {
    path: '/',
  });
  gotoMain();
};

export const getSavedToken = (): string => {
  return parseCookies()[ACCESS_TOKEN_STORE_KEY];
};

export const getUserInfo = (): User | undefined => {
  const accessToken = getSavedToken();

  if (accessToken) {
    const decodedToken = jwt_decode(accessToken);
    return decodedToken as User;
  }

  return undefined;
};

export const gotoMain = () => {
  location.replace('/');
};
