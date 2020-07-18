import React, { ChangeEventHandler, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { RecoilRoot, useRecoilState } from 'recoil';
import produce from 'immer';
import {
  CameraVideo,
  EditorContainer,
  PreviewVideo,
  RecordButton,
  Scaffold,
  VideoContainer,
} from './styles';
import { getCameraMirrorRefCallback } from './utils';
import { slideEditorState, createNewSlideData, slideState } from './states';
import Slide from './Slide';

let recorder: RecordRTC;

const VideoEdit: React.FC = () => {
  const videoRefCallback = getCameraMirrorRefCallback();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        recorder = new RecordRTC(stream, {
          type: 'video',
          video: { width: 1920, height: 1080 },
        });
      });
  }, []);

  const [slideEditor, setSlideEditor] = useRecoilState(slideEditorState);
  const { currentSlideIndex } = slideEditor;
  const [currentSlide, setCurrentSlide] = useRecoilState(
    slideState(currentSlideIndex)
  );

  // a state observer for debugging
  useEffect(() => {
    console.log('ATOM', currentSlide);
  }, [currentSlide]);

  const setCurrentSlideIndex = (index: number) => {
    setSlideEditor({ ...slideEditor, currentSlideIndex: index });
  };

  const addDefaultSlideToLast = () => {
    setSlideEditor((state) =>
      produce(state, (draftState) => {
        draftState.slides.push(createNewSlideData());
        draftState.currentSlideIndex = draftState.slides.length - 1;
      })
    );
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
    setCurrentSlide((videoEdit) => ({
      ...videoEdit,
      previewVideoObjectUrl: url,
    }));
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

  const handlePreviewTimeUpdate: ChangeEventHandler<HTMLVideoElement> = (
    event
  ) => {
    setPreviewCurrentTime(event.currentTarget.currentTime);
  };

  return (
    <Scaffold>
      <EditorContainer>
        {slideEditor.slides.map(({ id }, index) => (
          <button
            key={id}
            style={{ color: index === currentSlideIndex ? 'red' : '#aaa' }}
            onClick={() => {
              setCurrentSlideIndex(index);
            }}
          >
            {index}
          </button>
        ))}
        <button
          onClick={() => {
            addDefaultSlideToLast();
          }}
        >
          +
        </button>
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
        <CameraVideo ref={videoRefCallback}
          autoPlay
          controls={false}
          muted
        />
        {!currentSlide.isRecording ? (
          <RecordButton onClick={handleStartClick}>
            start recording
          </RecordButton>
        ) : (
          <RecordButton onClick={handleStopClick}>stop recording</RecordButton>
        )}
        {currentSlide.previewVideoObjectUrl && (
          <div>
            <h2>Record Preview</h2>
            <PreviewVideo
              onTimeUpdate={handlePreviewTimeUpdate}
              src={currentSlide.previewVideoObjectUrl}
              controls
              width="250"
            />
          </div>
        )}
      </VideoContainer>
    </Scaffold>
  );
};

export default () => (
  <RecoilRoot>
    <VideoEdit />
  </RecoilRoot>
);
