import React, { ChangeEventHandler, useEffect, useRef, useCallback, useState } from 'react';
import RecordRTC from 'recordrtc';
import { useRecoilState, useRecoilValue } from 'recoil';
import produce from 'immer';

import { getCameraMirrorRefCallback } from './utils';
import { slideEditorState, createNewSlideData, slideState, EditingState, previewSlideIndexState } from './states';

import * as S from './styles';
import Slide from './Slide';
import { Container, Row, Col } from 'react-grid-system';
import moment from 'moment';
import FlatButton from '../common/FlatButton';
import VideoRecordingController from './VideoRecordingController';
import Slider from '@material-ui/core/Slider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { withStyles } from '@material-ui/core/styles';

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
  const [previewDuration, setPreviewDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  const registerPreviewVideoEl = useCallback<(el: HTMLVideoElement) => void>((el) => {
    previewVideoElRef.current = el;
    el.addEventListener('canplaythrough', () => {
      setPreviewDuration(el.duration);
    });
    el.addEventListener('play', () => {
      setPlaying(true);
    });
    el.addEventListener('pause', () => {
      setPlaying(false);
    });
  }, []);

  const previewVideoElRef = useRef<HTMLVideoElement | undefined>();

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

  const startRecording = () => {
    if (slideEditor.editingState === EditingState.Recording) {
      return;
    }
    setSlideEditor(slideEditor => ({ ...slideEditor, editingState: EditingState.Recording }));
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
              <div key={id}
                style={{ opacity: slideEditor.editingState === EditingState.Previewing && index !== highlightedSlideIndex ? 0.3 : 1 }}
              >
                <Slide
                  slideIndex={index}
                  selected={index === highlightedSlideIndex}
                  onFocused={setCurrentSlideIndex}
                />
              </div>
            ))}
            {slideEditor.editingState === EditingState.Editing && <FlatButton onClick={addNewSlide}>
              새로운 문단 추가
            </FlatButton>}
            <S.SlideSpacer />
          </Col>
          <Col sm={3}>
            <S.VideoContainer>
              {slideEditor.preview.videoObjectUrl && (
                <div>
                  <h2>미리 보기</h2>
                  <S.CameraVideo
                    ref={registerPreviewVideoEl}
                    onTimeUpdate={handlePreviewTimeUpdate}
                    src={slideEditor.preview.videoObjectUrl}
                    width="250"
                  />
                </div>
              )}
              {slideEditor.editingState !== EditingState.Previewing && (
                <>
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
                </>
              )}
            </S.VideoContainer>
          </Col>
        </Row>
      </Container>
      {slideEditor.editingState === EditingState.Previewing && previewDuration > 0 && (
        <S.BottomBar>
          <Container>
            <Row>
              <Col sm={12}>
                <CustomSlider
                  className="audio-slider"
                  step={0.2}
                  min={0}
                  max={previewDuration}
                  value={slideEditor.preview.currentTime}
                  onChange={(_, value) => {
                    // TODO: Change
                    const videoEl = previewVideoElRef.current;
                    if (videoEl) {
                      videoEl.currentTime = value as number;
                    }
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={2}>
                <S.AudioTimeWrapper style={{ color: 'white' }}>
                  {moment.unix(slideEditor.preview.currentTime).format('mm:ss')} / {moment.unix(previewDuration).format('mm:ss')}
                </S.AudioTimeWrapper>
              </Col>
              <Col sm={8} />
              <Col sm={2}>
                {!playing &&
                  <S.AudioButtonWrapper onClick={() => { previewVideoElRef.current?.play(); }}>
                    <PlayArrowIcon style={{ color: 'white' }} />
                  </S.AudioButtonWrapper>
                }
                {playing &&
                  <S.AudioButtonWrapper onClick={() => { previewVideoElRef.current?.pause(); }}>
                    <PauseIcon style={{ color: 'white' }} />
                  </S.AudioButtonWrapper>
                }
              </Col>
            </Row>
          </Container>
        </S.BottomBar>
      )}
    </div>
  );
};

export default () => <VideoEdit />;

const CustomSlider = withStyles({
  root: {
    color: '#00ffb6',
    height: 8,
  },
})(Slider);
