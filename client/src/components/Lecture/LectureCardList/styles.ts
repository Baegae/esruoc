import styled from 'styled-components';
import {Col, Container} from 'react-grid-system';

export const CardContainer = styled(Container)`
  margin-top: 40px;
`;

export const Card = styled(Col)`
  background: white;
  border: 2px solid rgba(51, 58, 61, 0.15);
  height: 380px;
  border-radius: 8px;
  margin-bottom: 30px;
  padding: 0 !important;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  
  &:hover {
    transform: scale(1.025);
  }
`;

export const LectureImage = styled.div<{url: string}>`
  width: calc(100% + 4px);
  height: 55%;
  background: no-repeat center/cover url(${({url}) => url});
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-left: -2px;
  margin-top: -2px;
`;

export const TextArea = styled.div`
  padding: 16px;
  width: 100%;
  height: 45%;
`;

export const LectureCardTitle = styled.p`
  width: 80%;
  font-size: 1.5rem;
  word-break: break-word;
  margin-top: 5px;
`;

export const BottomArea = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 18px;
`;

export const BottomText = styled.div`
  font-size: 1rem;
  color: rgba(51, 58, 61, 0.55);
`;
