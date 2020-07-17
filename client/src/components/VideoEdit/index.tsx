import React, {useCallback, useEffect, useRef} from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

let recorder: RecordRTC;

import styled from 'styled-components';
import Editor from '../Editor';
import {RecoilRoot, atom, useRecoilState, selector, useRecoilValue} from 'recoil/dist';
import {OutputData} from '@editorjs/editorjs';

const VideoEdit: React.FC /**
 *
 */
  = () => {

    const [videoEdit, setVideoEdit] = useRecoilState(videoEditState);
    useEffect(() => {
      console.log('ATOM', videoEdit);
    }, [videoEdit]);

    const resetRecording = () => {
      setVideoEdit((state) => ({
        ...state,
        changes: [],
        viewingChangeIndex: -1,
        recordingStartedAt: new Date().getTime(),
        previewVideoObjectUrl: undefined,
        previewCurrentTime: 0,
      }));
    };

    const addTextChange = (textData: OutputData) => {
      setVideoEdit((videoEdit) => ({
        ...videoEdit,
        // originalEditorData,
        changes: [...videoEdit.changes, { data:textData, videoTimestamp: (new Date().getTime() - videoEdit.recordingStartedAt) / 1000 }]
      }));
    };

    const setIsRecording = (isRecording: boolean) => {
      setVideoEdit((videoEdit) => ({...videoEdit, isRecording}));
    };

    const setPreviewUrl = (url: string) => {
      setVideoEdit((videoEdit) => ({...videoEdit, previewVideoObjectUrl: url}));
    };

    const moveChangeIndex = (delta: number) => {
      setVideoEdit((state) => {
        const nextIndex = state.viewingChangeIndex + delta;
        if (!(nextIndex >= -1 && nextIndex < state.changes.length)) {
          return state;
        }
        return ({...state, viewingChangeIndex: state.viewingChangeIndex + delta});
      });
    };

    const setPreviewCurrentTime = (currentTime: number) => {
      setVideoEdit((state) => ({...state, previewCurrentTime: currentTime}));
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
      resetRecording();
      recorder.startRecording();
    };

    const handleStopClick = () => {
      recorder.stopRecording(() => {
        setPreviewUrl(recorder.toURL());
        setIsRecording(false);
        // uploadVideoToServer(recorder.getBlob()).then(() => {
        //   alert('upload ok!');
        // });
      });
    };

    const handleTextDataChange = useCallback<(data: OutputData) => void>(
      (textData) => {
        if (!videoEdit.isRecording) {
          return;
        }
        addTextChange(textData);
      }, [addTextChange, videoEdit.isRecording]);

    return <Scaffold>
      <EditorContainer>
        <Editor
          data={useRecoilValue(editorTextDataState)}
          onChange={handleTextDataChange}
        />
      </EditorContainer>
      <VideoContainer>
        <CameraVideo
          ref={videoRefCallback}
          autoPlay
          controls={false}
          muted
        />
        {!videoEdit.isRecording
          ? <RecordButton onClick={handleStartClick}>start recording</RecordButton>
          : <RecordButton onClick={handleStopClick}>stop recording</RecordButton>}
        {videoEdit.previewVideoObjectUrl && <div>
          <h2>Record Preview</h2>
          <PreviewVideo
            onTimeUpdate={(event) => {
              setPreviewCurrentTime(event.currentTarget.currentTime);
            }}
            src={videoEdit.previewVideoObjectUrl}
            controls
            width="250"
          />
        </div>}
      </VideoContainer>
    </Scaffold>;
  };

export default () => <RecoilRoot><VideoEdit/></RecoilRoot>;

const Scaffold = styled.div`
  font-family: 'SpoqaHanSans';

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

const PreviewVideo = styled.video`
  transform: scaleX(-1);
`;

const EditorContainer = styled.div`
  flex: 1;
`;

const RecordButton = styled.button`
  font-size: 2rem;
`;

interface State {
  originalEditorData: any;
  changes: TextDataChange[];
  viewingChangeIndex: number;
  isRecording: boolean;
  recordingStartedAt: number;
  previewVideoObjectUrl?: string;
  previewCurrentTime: number;
}

interface TextDataChange {
  data: OutputData;
  videoTimestamp: number;
}

const videoEditState = atom<State>({
  key: 'videoEditState',
  default: {
    originalEditorData: {'time':1595009894317,'blocks':[{'type':'header','data':{'text':'새로운 강의 방식을 만들고 있어요.','level':2}},{'type':'paragraph','data':{'text':'노션처럼 쉬운 블록 기반 에디터와 중요한 정보를 효과적으로 알릴 수 있는 포맷팅 타임라인 기능.<br>웹에서 비디오 녹화까지.'}},{'type':'paragraph','data':{'text':'쉽게 제작하고, 효율적으로 온라인 강의를 체험해보세요'}}],'version':'2.18.0'},
    changes: [],
    viewingChangeIndex: -1,
    isRecording: false,
    recordingStartedAt: 0,
    previewVideoObjectUrl: undefined,
    previewCurrentTime: 0,
  },
});

const previewTextChangeIndexState = selector({
  key: 'previewTextChangeIndexState',
  get: ({get}) => {
    const videoEdit = get(videoEditState);
    const index = [...videoEdit.changes].reverse().findIndex((textChange) => textChange.videoTimestamp <= videoEdit.previewCurrentTime);
    return index === -1 ? -1 : videoEdit.changes.length - index - 1;
  },
});

const editorTextDataState = selector({
  key: 'editorTextDataState',
  get: ({get}) => {
    const videoEdit = get(videoEditState);
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }
    // CONTROL
    const previewTextChangeIndex = get(previewTextChangeIndexState);
    return (previewTextChangeIndex >= 0 ? videoEdit.changes[previewTextChangeIndex].data : videoEdit.originalEditorData);
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
