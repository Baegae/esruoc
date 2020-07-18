import React, { ChangeEventHandler, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import produce from 'immer';
import Editor, { EditorTextSelection } from '../Editor';
import { atom, RecoilRoot, selector, useRecoilState, useRecoilValue, DefaultValue, selectorFamily } from 'recoil/dist';
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

  const [slideEditor, setSlideEditor] = useRecoilState(slideEditorState);
  const { currentSlideIndex } = slideEditor;
  const [currentSlide, setCurrentSlide] = useRecoilState(getSlideState(currentSlideIndex));

  // a state observer for debugging
  useEffect(() => {
    console.log('ATOM', currentSlide);
  }, [currentSlide]);

  const setCurrentSlideIndex = (index: number) => {
    setSlideEditor({ ...slideEditor, currentSlideIndex: index });
  };

  // Actions for state
  const resetAndStartRecording = () => {
    setCurrentSlide((state) => ({
      ...state,
      changes: [],
      selectionChanges: [],
      recordingStartedAt: new Date().getTime(),
      previewVideoObjectUrl: undefined,
      previewCurrentTime: 0,
    }));
  };

  const setIsRecording = (isRecording: boolean) => {
    setCurrentSlide((videoEdit) => ({ ...videoEdit, isRecording }));
  };

  const setPreviewUrl = (url: string) => {
    setCurrentSlide((videoEdit) => ({ ...videoEdit, previewVideoObjectUrl: url }));
  };

  const setPreviewCurrentTime = (currentTime: number) => {
    setCurrentSlide((state) => ({ ...state, previewCurrentTime: currentTime }));
  };

  // Handlers
  const handleStartClick = () => {
    if (currentSlide.isRecording) {
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

  const handlePreviewTimeUpdate: ChangeEventHandler<HTMLVideoElement> = (event) => {
    setPreviewCurrentTime(event.currentTarget.currentTime);
  };

  return (
    <Scaffold>
      <EditorContainer>
        {slideEditor.slides.map(({ id }, index) => (
          <button key={id}
            onClick={() => { setCurrentSlideIndex(index); }}
          >
            {index}
          </button>
        ))}
        {slideEditor.slides.map(({ id }, index) => {
          return (
            <Slide
              key={id}
              slideIndex={index}
              selected={index === currentSlideIndex}
            />
          );
        })}
      </EditorContainer>
      <VideoContainer>
        <CameraVideo
          ref={videoRefCallback}
          autoPlay
          controls={false}
          muted
        />
        {!currentSlide.isRecording
          ? <RecordButton onClick={handleStartClick}>start recording</RecordButton>
          : <RecordButton onClick={handleStopClick}>stop recording</RecordButton>}
        {currentSlide.previewVideoObjectUrl && <div>
          <h2>Record Preview</h2>
          <PreviewVideo
            onTimeUpdate={handlePreviewTimeUpdate}
            src={currentSlide.previewVideoObjectUrl}
            controls
            width="250"
          />
        </div>}
      </VideoContainer>
    </Scaffold>);

};

const Slide: React.FC<{ slideIndex: number; selected?: boolean }> = ({ slideIndex, selected }) => {
  const editorData = useRecoilValue(editorTextDataState(slideIndex));
  const previewSelectionData = useRecoilValue(editorPreviewHighlightState(slideIndex));

  const [currentSlide, setCurrentSlide] = useRecoilState(getSlideState(slideIndex));

  const addTextChange = useCallback<(data: OutputData) => void>((textData: OutputData) => {
    setCurrentSlide((state) => produce(state, (draftState) => {
      draftState.changes.push({ data: textData, videoTimestamp: (new Date().getTime() - currentSlide.recordingStartedAt) / 1000 });
    }));
  }, [currentSlide.recordingStartedAt, setCurrentSlide]);

  // TODO: Node기반 position으로 바꾸어 responsive하게 동작하게 만들기 
  const addSelectionChange = (rects?: EditorTextSelection[]) => {
    setCurrentSlide((state) => produce(state, (draftState) => {
      draftState.selectionChanges.push({ data: rects, videoTimestamp: (new Date().getTime() - currentSlide.recordingStartedAt) / 1000 });
    }));
  };

  const handleTextDataChange = useCallback<(data: OutputData) => void>(
    (textData) => {
      if (!currentSlide.isRecording) {
        return;
      }
      addTextChange(textData);
    }, [addTextChange, currentSlide.isRecording]);

  const handleSelectionChange = (rects?: EditorTextSelection[]) => {
    if (!currentSlide.isRecording) {
      return;
    }
    addSelectionChange(rects);
  };

  return (
    <div style={{ backgroundColor: selected ? 'yellow' : undefined }}>
      <Editor
        data={editorData}
        onChange={handleTextDataChange}
        selection={previewSelectionData}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default () => (
  <RecoilRoot>
    <VideoEdit />
  </RecoilRoot>
);

interface SlideEditorState {
  currentSlideIndex: number;
  slides: SlideState[];
  // 아직 안씀
  editingState: EditingState;
}

// TODO:
// Recording에서 change 기록 및 비디오 녹화
// Editing에서 originalEditorData를 변경할 수 있게
// Previewing에서 녹화한 강의 재생 (contenteditable=false)
enum EditingState {
  Recording,
  Editing,
  Previewing,
}

interface SlideState {
  id: string;
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

const defaultSlideData: SlideState = {
  id: '0',
  originalEditorData: initialData,
  changes: [],
  selectionChanges: [],
  isRecording: false,
  recordingStartedAt: 0,
  previewVideoObjectUrl: undefined,
  previewCurrentTime: 0,
};

const slideEditorState = atom<SlideEditorState>({
  key: 'slideEditorState',
  default: {
    currentSlideIndex: 0,
    slides: [defaultSlideData, Object.assign({ id: '1' }, defaultSlideData)],
    editingState: EditingState.Editing
  },
});

const getSlideState = selectorFamily<SlideState, number>({
  key: 'currentSlideState',
  get: slideIndex => ({ get }) => {
    const slideEditor = get(slideEditorState);
    return slideEditor.slides[slideIndex];
  },
  set: slideIndex => ({ get, set }, newValue) => {
    set(slideEditorState, produce(get(slideEditorState), draftState => {
      if (newValue instanceof DefaultValue) {
        draftState.slides[slideIndex] = defaultSlideData;
        return;
      }
      draftState.slides[slideIndex] = newValue;
    }));
  },
});

const latestTextChangeState = selectorFamily<OutputData, number>({
  key: 'latestTextChangeState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(getSlideState(slideIndex));
    const isChangeBeforeCurrentTime = (textChange: TextDataChange) => textChange.videoTimestamp <= videoEdit.previewCurrentTime;
    const latestChangeBeforeCurrentTime = videoEdit.changes.filter(isChangeBeforeCurrentTime).slice(-1);
    // 최근 수정 사항이 없으면 첫 text로 시작함
    return (latestChangeBeforeCurrentTime.length > 0 ? latestChangeBeforeCurrentTime[0].data : videoEdit.originalEditorData);
  },
});

const editorTextDataState = selectorFamily<OutputData | undefined, number>({
  key: 'editorTextDataState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(getSlideState(slideIndex));
    // NO CONTROL WHEN ENABLED WRITING
    if (videoEdit.isRecording) {
      return;
    }
    // CONTROL
    return get(latestTextChangeState(slideIndex));
  },
});

const editorPreviewHighlightState = selectorFamily<EditorTextSelection[] | undefined, number>({
  key: 'editorPreviewHighlightState',
  get: slideIndex => ({ get }) => {
    const videoEdit = get(getSlideState(slideIndex));
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
