import React, { ChangeEventHandler, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { RecoilRoot, useRecoilState } from 'recoil';
import produce from 'immer';

import { getCameraMirrorRefCallback } from './utils';
import { slideEditorState, createNewSlideData, slideState } from './states';

import * as S from './styles';
import Slide from './Slide';
import { Container, Row, Col } from 'react-grid-system';
import FlatButton from '../common/FlatButton';
import VideoRecordingController from './VideoRecordingController';

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

  const startRecording = () => {
    if (currentSlide.isRecording) {
      return;
    }
    setIsRecording(true);
    resetAndStartRecording();
    recorder.startRecording();
  };

  const stopRecording = () => {
    recorder.stopRecording(() => {
      setPreviewUrl(recorder.toURL());
      setIsRecording(false);
      // uploadVideoToServer(recorder.getBlob()).then(() => {
      //   alert('upload ok!');
      // });
    });
  };

  const handlePressPreviousSlide:
    | React.MouseEventHandler
    | undefined = slideEditor.slides[currentSlideIndex - 1]
      ? () => setCurrentSlideIndex(currentSlideIndex - 1)
      : undefined;

  const handlePressNextSlide: React.MouseEventHandler | undefined = slideEditor
    .slides[currentSlideIndex + 1]
    ? () => setCurrentSlideIndex(currentSlideIndex + 1)
    : undefined;

  const handlePressRecording:
    | React.MouseEventHandler
    | undefined = currentSlide.isRecording ? undefined : startRecording;

  const handlePressStop:
    | React.MouseEventHandler
    | undefined = !currentSlide.isRecording ? undefined : stopRecording;

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

  const handlePreviewTimeUpdate: ChangeEventHandler<HTMLVideoElement> = (
    event
  ) => {
    setPreviewCurrentTime(event.currentTarget.currentTime);
  };

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <Container>
        <Row>
          <Col sm={9}>
            {slideEditor.slides.map(({ id }, index) => (
              <Slide
                key={id}
                slideIndex={index}
                selected={index === currentSlideIndex}
                onFocused={setCurrentSlideIndex}
              />
            ))}
            <FlatButton onClick={addNewSlide}>
              새로운 문단 추가
            </FlatButton>
          </Col>
          <Col sm={3}>
            <S.CameraVideo
              ref={videoRefCallback}
              autoPlay
              controls={false}
              muted
            />
            <VideoRecordingController
              onPressNext={handlePressNextSlide}
              onPressPrevious={handlePressPreviousSlide}
              onPressRecording={handlePressRecording}
              onPressStop={handlePressStop}
            />
            {currentSlide.previewVideoObjectUrl && (
              <div>
                <h2>[DEBUG] Record Preview</h2>
                <S.CameraVideo
                  onTimeUpdate={handlePreviewTimeUpdate}
                  src={currentSlide.previewVideoObjectUrl}
                  controls
                  width="250"
                />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default () => (
  <RecoilRoot>
    <VideoEdit />
  </RecoilRoot>
);
