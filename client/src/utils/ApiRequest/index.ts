import axios from 'axios';
import {deleteAccessToken, getSavedToken, getUserInfo, gotoMain, setAccessToken} from '@src/utils/Login';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

axiosInstance.interceptors.request.use((request) => {
  if (getUserInfo()) {
    request.headers['Authorization'] = getSavedToken();
  }

  return request;
});

axiosInstance.interceptors.response.use((response) => {
  if (response.status == 200 && response.request.responseURL.endsWith('/user/login')) {
    setAccessToken(response.data);
  }

  return response;
}, function (error) {
  if (error.response && error.response.status === 401 && !error.response.request.responseURL.endsWith('/user/login')) {
    deleteAccessToken();
    gotoMain();

    return error;
  }
});

export default axiosInstance;
