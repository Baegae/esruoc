import React from 'react';
import FlatButton from '@src/components/common/FlatButton';

import * as S from './styles';

interface VideoRecordingControllerProps {
  onPressPrevious?: React.MouseEventHandler;
  onPressNext?: React.MouseEventHandler;
  onPressRecording?: React.MouseEventHandler;
  onPressStop?: React.MouseEventHandler;
}

const VideoRecordingController: React.FC<VideoRecordingControllerProps> = ({
  onPressPrevious,
  onPressNext,
  onPressRecording,
  onPressStop,
}) => {
  return (
    <S.ControllerWrapper>
      <S.IconButton
        onClick={onPressPrevious}
        isDisabled={!onPressPrevious}
      >
        <S.PreviousSlideIcon />
      </S.IconButton>
      {!!onPressStop && (
        <S.IconButton onClick={onPressStop}>
          <S.StopRecordingIcon />
        </S.IconButton>
      )}
      {!!onPressRecording && (
        <S.IconButton onClick={onPressRecording}>
          <S.StartRecordingIcon />
        </S.IconButton>
      )}
      <S.IconButton 
        onClick={onPressNext}
        isDisabled={!onPressNext}
      >
        <S.NextSlideIcon />
      </S.IconButton>
    </S.ControllerWrapper>
  );
};

export default VideoRecordingController;
