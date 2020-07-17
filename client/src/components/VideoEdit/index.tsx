import React, {useCallback, useEffect, useRef} from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

let recorder: RecordRTC;

import styled from 'styled-components';
import Editor from '../Editor';
import {RecoilRoot, atom, useRecoilState} from 'recoil/dist';
import {OutputData} from '@editorjs/editorjs';

const VideoEdit: React.FC /**
 *
 */
  = () => {

    const [videoEdit, setVideoEdit] = useRecoilState(videoEditState);
    useEffect(() => {
      console.log('ATOM', videoEdit);
    }, [videoEdit]);

    const addTextChange = (textData: OutputData) => {
      setVideoEdit((videoEdit) => ({
        ...videoEdit,
        // originalEditorData,
        changes: [...videoEdit.changes, textData]
      }));
    };

    const setIsRecording = (isRecording: boolean) => {
      setVideoEdit((videoEdit) => ({...videoEdit, isRecording}));
    };

    const setPreviewUrl = (url: string) => {
      setVideoEdit((videoEdit) => ({...videoEdit, videoObjectUrl: url}));
    };

    const videoRefCallback = getCameraMirrorRefCallback();

    useEffect(() => {
      navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
        recorder = new RecordRTC(stream, {type: 'video', video: {width: 1920, height: 1080}});
      });
    }, []);

    const handleStartClick = () => {
    // TODO: 예전 텍스트로 리셋하기
      if (videoEdit.isRecording) {
        return;
      }
      setIsRecording(true);
      recorder.startRecording();
    };

    const handleStopClick = () => {
      recorder.stopRecording(() => {
        setPreviewUrl(recorder.toURL());
        setIsRecording(false);
        uploadVideoToServer(recorder.getBlob()).then(() => {
          alert('upload ok!');
        });
      });
    };

    const handleTextDataChange = useCallback<(data: OutputData) => void>(
      (textData) => {
        if (!videoEdit.isRecording) {
          return;
        }
        addTextChange(textData);
      }, [setVideoEdit, videoEdit.isRecording]);

    return <Scaffold>
      <EditorContainer>
        <Editor onChange={handleTextDataChange}/>
      </EditorContainer>
      <VideoContainer>
        <CameraVideo
          ref={videoRefCallback}
          autoPlay
          controls={false}
          muted
        />
        <div>
        Record Preview
          <video
            src={videoEdit.videoObjectUrl}
            controls
            width="250"
          />
          {!videoEdit.isRecording
            ? <button onClick={handleStartClick}>start recording</button>
            : <button onClick={handleStopClick}>stop recording</button>}
        </div>
      </VideoContainer>
    </Scaffold>;
  };

export default () => <RecoilRoot><VideoEdit/></RecoilRoot>;

const Scaffold = styled.div`
  display: flex;
  flex-direction: row;
`;

const VideoContainer = styled.div`
  flex: 1;
  max-width: 30rem;
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const CameraVideo = styled.video`
  transform: scaleX(-1);
`;

const EditorContainer = styled.div`
  flex: 1;
`;

interface State {
  originalEditorData: any;
  changes: any[];
  isRecording: boolean;
  videoObjectUrl?: string;
}

const videoEditState = atom<State>({
  key: 'videoEditState',
  default: {
    originalEditorData: null,
    changes: [],
    isRecording: false,
    videoObjectUrl: undefined,
  },
});

const uploadVideoToServer = (video: Blob) => {
  const formData = new FormData();
  formData.append('video', video);
  return axios.post('http://10.10.20.230:3001/upload-video', formData);
};

const getCameraMirrorRefCallback = () => {
  return useCallback<(el: HTMLVideoElement) => void>((el) => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
      if (el === null) {
        return;
      }
      el.srcObject = stream;
    });
  }, []);
};
