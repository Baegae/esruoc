import styled from 'styled-components';

export const Scaffold = styled.div`
  font-family: 'SpoqaHanSans';

  display: flex;
  flex-direction: row;
`;
export const VideoContainer = styled.div`
  flex: 1;
  max-width: 30rem;
  
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
export const CameraVideo = styled.video`
  transform: scaleX(-1);
`;
export const PreviewVideo = styled.video`
  transform: scaleX(-1);
`;
export const EditorContainer = styled.div`
  flex: 1;
`;
export const RecordButton = styled.button`
  font-size: 2rem;
`;
