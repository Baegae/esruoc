import React, { ChangeEventHandler, useEffect, useRef } from 'react';
import RecordRTC from 'recordrtc';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import produce from 'immer';

import { getCameraMirrorRefCallback } from './utils';
import { slideEditorState, createNewSlideData, slideState, EditingState, previewSlideIndexState } from './states';

import * as S from './styles';
import Slide from './Slide';
import { Container, Row, Col } from 'react-grid-system';
import FlatButton from '../common/FlatButton';
import VideoRecordingController from './VideoRecordingController';

let recorder: RecordRTC;

export function useScrollEffectToChild<E extends HTMLElement = HTMLElement>(query: string, ready: boolean) {

  const containerRef = useRef<E | undefined>();

  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !container) return;

    const elem = container.querySelector(query);

    if (!elem) return;
    elem.scrollIntoView({ block: 'end', behavior: 'smooth' });

  }, [query, ready]);

  return containerRef;
}


const VideoEdit: React.FC = () => {
  const [slideEditor, setSlideEditor] = useRecoilState(slideEditorState);
  const { currentSlideIndex } = slideEditor;
  const [currentSlide] = useRecoilState(
    slideState(currentSlideIndex)
  );
  const previewSlideIndex = useRecoilValue(previewSlideIndexState);
  useEffect(() => {
    if (slideEditor.editingState !== EditingState.Previewing) {
      return;
    }
    console.log('index change plz to ', previewSlideIndex);
  }, [previewSlideIndex, slideEditor.editingState]);
  const slideListRef = useScrollEffectToChild(`[data-slide-index="${previewSlideIndex}"]`, previewSlideIndex !== undefined);
  slideListRef.current = document.documentElement;

  const videoRefCallback = getCameraMirrorRefCallback();

  // a state observer for debugging
  useEffect(() => {
    console.log('[recoil] slideEditor', slideEditor);
  }, [slideEditor]);
  useEffect(() => {
    console.log('[recoil] currentSlide', currentSlide);
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
    setSlideEditor((slideEditor) => produce(slideEditor, draftState => {
      draftState.currentSlideIndex = index;
      if (draftState.editingState !== EditingState.Recording) {
        return;
      }
      draftState.slideIndexChange.push({ data: index, videoTimestamp: (new Date().getTime() - draftState.recordingStartedAt) / 1000 });
    }));
  };

  // Actions for state
  const discardRecording = () => {
    setSlideEditor((slideEditor) => (produce(slideEditor, draftState => {
      draftState.editingState = EditingState.Editing;
      draftState.preview = {
        videoObjectUrl: '',
        currentTime: 0,
      };
      draftState.slides.forEach(slide => {
        slide.changes = [];
        slide.selectionChanges = [];
      });
      draftState.slideIndexChange = [];
    })));
  };

  const startRecording = () => {
    if (slideEditor.editingState === EditingState.Recording) {
      return;
    }
    discardRecording();
    setSlideEditor({ ...slideEditor, editingState: EditingState.Recording });
    setSlideEditor((state) => produce(state, draftState => {
      draftState.recordingStartedAt = new Date().getTime();
    }));
    // change에 현재 인덱스 추가
    setCurrentSlideIndex(slideEditor.currentSlideIndex);
    recorder.startRecording();
  };

  const stopRecording = () => {
    recorder.stopRecording(() => {
      setPreviewUrl(recorder.toURL());
      setSlideEditor((slideEditor) => ({ ...slideEditor, editingState: EditingState.Previewing }));
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
    | undefined = slideEditor.editingState === EditingState.Editing ? startRecording : undefined;

  const handlePressStop:
    | React.MouseEventHandler
    | undefined = slideEditor.editingState === EditingState.Recording ? stopRecording : undefined;

  const addNewSlide = () => {
    setSlideEditor((state) =>
      produce(state, (draftState) => {
        draftState.slides.push(createNewSlideData());
        draftState.currentSlideIndex = draftState.slides.length - 1;
      })
    );
  };

  const setPreviewUrl = (url: string) => {
    setSlideEditor((state) => produce(state, draftState => {
      draftState.preview.videoObjectUrl = url;
    }));
  };

  const setPreviewCurrentTime = (currentTime: number) => {
    setSlideEditor((state) => produce(state, draftState => {
      draftState.preview.currentTime = currentTime;
    }));
  };

  const handlePreviewTimeUpdate: ChangeEventHandler<HTMLVideoElement> = (
    event
  ) => {
    setPreviewCurrentTime(event.currentTarget.currentTime);
  };

  const highlightedSlideIndex = (slideEditor.editingState === EditingState.Previewing ? previewSlideIndex : currentSlideIndex);

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <Container>
        <Row>
          <Col sm={9}>
            {slideEditor.slides.map(({ id }, index) => (
              <Slide
                key={id}
                slideIndex={index}
                selected={index === highlightedSlideIndex}
                onFocused={setCurrentSlideIndex}
              />
            ))}
            <FlatButton onClick={addNewSlide}>
              새로운 문단 추가
            </FlatButton>
            <S.SlideSpacer />
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
            {slideEditor.editingState === EditingState.Previewing && <button onClick={discardRecording}>discard</button>}
            {slideEditor.preview.videoObjectUrl && (
              <div>
                <h2>[DEBUG] Record Preview</h2>
                <S.CameraVideo
                  onTimeUpdate={handlePreviewTimeUpdate}
                  src={slideEditor.preview.videoObjectUrl}
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

export default () => <VideoEdit />;
