import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {setCookie, parseCookies, destroyCookie} from 'nookies';

import Router from 'next/router';
import User from '@shared/src/entity/User';

const ACCESS_TOKEN_STORE_KEY = 'esruoc-access-token';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.request.use((request) => {
  if (getUserInfo()) {
    request.headers['Authorization'] = getSavedToken();
  }

  return request;
});

axiosInstance.interceptors.response.use((response) => {
  if (response.status == 200 && response.request.url.endsWith('/user/login')) {
    setAccessToken(response.data.accessToken);
  }

  return response;
}, function (error) {
  if (error.response.status === 401 && !error.response.request.url.endsWith('/user/login')) {
    deleteAccessToken();
    _gotoMain();

    return error;
  }
});

export const setAccessToken = (accessToken: string) => {
  try {
    jwt_decode(accessToken);

    setCookie(null, ACCESS_TOKEN_STORE_KEY, accessToken, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
  } catch (e) {
    _gotoMain();
  }
};

export const deleteAccessToken = () => {
  destroyCookie(null, ACCESS_TOKEN_STORE_KEY);
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

const _gotoMain = () => {
  Router.push('/');
};

export default axiosInstance;
