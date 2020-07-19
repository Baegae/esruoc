import styled from 'styled-components';

export const VideoContainer = styled.div`
  position: sticky;
  top: 6rem;
`;

export const CameraVideo = styled.video`
  transform: scaleX(-1);
  width: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.375);
  background: ${({theme}) => theme.colors.text.caption};
`;

export const SlideSpacer = styled.div`
  height: 12rem;
`;

export const BottomBar = styled.div`
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background-color: black;
`;

export const AudioTimeWrapper = styled.div`
  font-size: 1rem;
`;

export const AudioButtonWrapper = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: flex-end;
`;
