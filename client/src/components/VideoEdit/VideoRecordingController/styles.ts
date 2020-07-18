import styled, {css} from 'styled-components';

import StartRecordingSvg from '@src/assets/start-recording.svg';
import StopRecordingSvg from '@src/assets/stop-recording.svg';
import NextSlideSvg from '@src/assets/next-slide.svg';
import PreviousSlideSvg from '@src/assets/previous-slide.svg';
import hexToRgba from '@src/styles/hexToRgba';

export const ControllerWrapper = styled.div`
  display: flex;
  width: fit-content;
  justify-content: space-around;
  align-items: center;
  margin: 1rem auto 0;
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  background: ${({theme}) => theme.colors.black};
`;

export const IconButton = styled.div<{isDisabled?: boolean}>`
  cursor: pointer;
  display: flex;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background 0.15s ease-in-out;
  align-self: stretch;
  align-items: center;
  margin: 0 0.25rem;

  &:hover {
    background: ${({theme}) => hexToRgba(theme.colors.primary, 0.2)};
    path {
      fill: ${({theme}) => theme.colors.primary};
    }
  }

  ${({isDisabled}) => isDisabled ? css`
    path {
      opacity: 0.5;
    }
    &:hover {
      background: transparent;
      path {
        fill: ${({theme}) => theme.colors.white};
      }
    }
  ` : undefined}
`;

export const iconStyle = css`
  path {
    fill: white;
    transition: fill 0.15s ease-in-out, opacity 0.15s ease-in-out;
  }
`;

export const StartRecordingIcon = styled(StartRecordingSvg)`
  ${iconStyle}
`;

export const StopRecordingIcon = styled(StopRecordingSvg)`
  ${iconStyle}
`;

export const NextSlideIcon = styled(NextSlideSvg)`
  ${iconStyle}
`;

export const PreviousSlideIcon = styled(PreviousSlideSvg)`
  ${iconStyle}
`;
