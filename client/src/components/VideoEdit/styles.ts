import styled from 'styled-components';

export const CameraVideo = styled.video`
  transform: scaleX(-1);
  width: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.375);
  background: ${({theme}) => theme.colors.text.caption};
`;

export const SlideSpacer = styled.div`
  height: 10rem;
`;
