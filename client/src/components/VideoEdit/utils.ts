import { useCallback } from 'react';
import axios from 'axios';

export const uploadVideoToServer = (video: Blob) => {
  const formData = new FormData();
  formData.append('video', video);
  return axios.post('http://10.10.20.230:3001/upload-video', formData);
};
  
export const getCameraMirrorRefCallback = () => {
  return useCallback<(el: HTMLVideoElement) => void>((el) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 } }).then((stream) => {
      if (el === null) {
        return;
      }
      el.srcObject = stream;
    });
  }, []);
};
  
