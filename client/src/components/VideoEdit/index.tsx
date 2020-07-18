import React, { ChangeEventHandler, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import produce from 'immer';
import Editor, { EditorTextSelection } from '../Editor';
import { atom, RecoilRoot, selector, useRecoilState, useRecoilValue } from 'recoil/dist';
import { OutputData } from '@editorjs/editorjs';
import { CameraVideo, EditorContainer, PreviewVideo, RecordButton, Scaffold, VideoContainer } from './styles';

let recorder: RecordRTC;

const VideoEdit: React.FC = () => {

  const videoRefCallback = getCameraMirrorRefCallback();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      recorder = new RecordRTC(stream, { type: 'video', video: { width: 1920, height: 1080 } });
    });
  }, []);

  const [videoEdit, setVideoEdit] = useRecoilState(videoEditState);
  const editorData = useRecoilValue(editorTextDataState);
  const previewSelectionData = useRecoilValue(editorPreviewHighlightState);

  // a state observer for debugging
  useEffect(() => {
    console.log('ATOM', videoEdit);
  }, [videoEdit]);

  // Actions for state
  const resetAndStartRecording = () => {
    setVideoEdit((state) => ({
      ...state,
      changes: [],
      selectionChanges: [],
      recordingStartedAt: new Date().getTime(),
      previewVideoObjectUrl: undefined,
      previewCurrentTime: 0,
    }));
  };

  const addTextChange = (textData: OutputData) => {
    setVideoEdit((state) => produce(state, (draftState) => {
      draftState.changes.push({ data: textData, videoTimestamp: (new Date().getTime() - videoEdit.recordingStartedAt) / 1000 });
    }));
  };

  // // TODO: Changes encoding through coordinate to 
  const addSelectionChange = (rects?: EditorTextSelection[]) => {
    setVideoEdit((state) => produce(state, (draftState) => {
      draftState.selectionChanges.push({ data: rects, videoTimestamp: (new Date().getTime() - videoEdit.recordingStartedAt) / 1000 });
    }));
  };

  const setIsRecording = (isRecording: boolean) => {
    setVideoEdit((videoEdit) => ({ ...videoEdit, isRecording }));
  };

  const setPreviewUrl = (url: string) => {
    setVideoEdit((videoEdit) => ({ ...videoEdit, previewVideoObjectUrl: url }));
  };

  const setPreviewCurrentTime = (currentTime: number) => {
    setVideoEdit((state) => ({ ...state, previewCurrentTime: currentTime }));
  };

  // Handlers
  const handleStartClick = () => {
    if (videoEdit.isRecording) {
      return;
    }
    setIsRecording(true);
    resetAndStartRecording();
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

  const handleSelectionChange = (rects?: EditorTextSelection[]) => {
    if (!videoEdit.isRecording) {
      return;
    }
    addSelectionChange(rects);
  };

  const handlePreviewTimeUpdate: ChangeEventHandler<HTMLVideoElement> = (event) => {
    setPreviewCurrentTime(event.currentTarget.currentTime);
  };

  return (
    <Scaffold>
      <EditorContainer>
        <Editor
          data={editorData}
          onChange={handleTextDataChange}
          selection={previewSelectionData}
          onSelectionChange={handleSelectionChange}
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
            onTimeUpdate={handlePreviewTimeUpdate}
            src={videoEdit.previewVideoObjectUrl}
            controls
            width="250"
          />
        </div>}
      </VideoContainer>
    </Scaffold>);

};

export default () => (
  <RecoilRoot>
    <VideoEdit />
  </RecoilRoot>
);

interface State {
  originalEditorData: OutputData;
  changes: TextDataChange[];
  selectionChanges: TextSelectionChange[];
  isRecording: boolean;
  recordingStartedAt: number;
  previewVideoObjectUrl?: string;
  previewCurrentTime: number;
}

interface TextDataChange {
  data: OutputData;
  videoTimestamp: number;
}

interface TextSelectionChange {
  data?: EditorTextSelection[];
  videoTimestamp: number;
}

const initialData: OutputData = { 'time': 1595009894317, 'blocks': [{ 'type': 'header', 'data': { 'text': '새로운 강의 방식을 만들고 있어요.', 'level': 2 } }, { 'type': 'paragraph', 'data': { 'text': '노션처럼 쉬운 블록 기반 에디터와 중요한 정보를 효과적으로 알릴 수 있는 포맷팅 타임라인 기능.<br>웹에서 비디오 녹화까지.' } }, { 'type': 'paragraph', 'data': { 'text': '쉽게 제작하고, 효율적으로 온라인 강의를 체험해보세요' } }], 'version': '2.18.0' };

const videoEditState = atom<State>({
  key: 'videoEditState',
  default: {
    originalEditorData: initialData,
    changes: [],
    selectionChanges: [],
    isRecording: false,
    recordingStartedAt: 0,
    previewVideoObjectUrl: undefined,
    previewCurrentTime: 0,
  },
});

const latestTextChangeState = selector<OutputData>({
  key: 'latestTextChangeState',
  get: ({ get }) => {
    const videoEdit = get(videoEditState);
    const isChangeBeforeCurrentTime = (textChange: TextDataChange) => textChange.videoTimestamp <= videoEdit.previewCurrentTime;
    const latestChangeBeforeCurrentTime = videoEdit.changes.filter(isChangeBeforeCurrentTime).slice(-1);
    // 최근 수정 사항이 없으면 첫 text로 시작함
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : videoEdit.originalEditorData);
  },
});

const editorTextDataState = selector({
  key: 'editorTextDataState',
  get: ({ get }) => {
    const videoEdit = get(videoEditState);
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }
    // CONTROL
    return get(latestTextChangeState);
  },
});

const editorPreviewHighlightState = selector<EditorTextSelection[] | undefined>({
  key: 'editorPreviewHighlightState',
  get: ({ get }) => {
    const videoEdit = get(videoEditState);
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }

    const isChangeBeforeCurrentTime = (change: TextSelectionChange) => change.videoTimestamp <= videoEdit.previewCurrentTime;
    const latestChangeBeforeCurrentTime = videoEdit.selectionChanges.filter(isChangeBeforeCurrentTime).slice(-1);
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : undefined);
  },
});

const uploadVideoToServer = (video: Blob) => {
  const formData = new FormData();
  formData.append('video', video);
  return axios.post('http://10.10.20.230:3001/upload-video', formData);
};

const getCameraMirrorRefCallback = () => {
  return useCallback<(el: HTMLVideoElement) => void>((el) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      if (el === null) {
        return;
      }
      el.srcObject = stream;
    });
  }, []);
};
