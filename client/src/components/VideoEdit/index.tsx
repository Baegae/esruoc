import React, { ChangeEventHandler, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { RecoilRoot, useRecoilState } from 'recoil';
import produce from 'immer';

import { getCameraMirrorRefCallback } from './utils';
import { slideEditorState, createNewSlideData, slideState } from './states';

import * as S from './styles';
import Slide from './Slide';

let recorder: RecordRTC;

const VideoEdit: React.FC = () => {
  const [slideEditor, setSlideEditor] = useRecoilState(slideEditorState);
  const { currentSlideIndex } = slideEditor;
  const [currentSlide, setCurrentSlide] = useRecoilState(
    slideState(currentSlideIndex)
  );

  const videoRefCallback = getCameraMirrorRefCallback();

  // a state observer for debugging
  useEffect(() => {
    console.log('ATOM', currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        recorder = new RecordRTC(stream, {
          type: 'video',
          video: { width: 1280, height: 720 },
        });
      });
  }, []);

  const setCurrentSlideIndex = (index: number) => {
    setSlideEditor({ ...slideEditor, currentSlideIndex: index });
  };

  const addNewSlide = () => {
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
    <S.Scaffold>
      <S.EditorContainer>
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
            addNewSlide();
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
      </S.EditorContainer>
      <S.VideoContainer>
        <S.CameraVideo
          ref={videoRefCallback}
          autoPlay
          controls={false}
          muted
        />
        {!currentSlide.isRecording ? (
          <S.RecordButton onClick={handleStartClick}>
            start recording
          </S.RecordButton>
        ) : (
          <S.RecordButton onClick={handleStopClick}>stop recording</S.RecordButton>
        )}
        {currentSlide.previewVideoObjectUrl && (
          <div>
            <h2>Record Preview</h2>
            <S.PreviewVideo
              onTimeUpdate={handlePreviewTimeUpdate}
              src={currentSlide.previewVideoObjectUrl}
              controls
              width="250"
            />
          </div>
        )}
      </S.VideoContainer>
    </S.Scaffold>
  );
};

export default () => (
  <RecoilRoot>
    <VideoEdit />
  </RecoilRoot>
);
