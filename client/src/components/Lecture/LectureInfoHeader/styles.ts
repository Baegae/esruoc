import styled from 'styled-components';
import hexToRgba from '@src/styles/hexToRgba';
import { Row } from 'react-grid-system';

export const AbsoluteRow = styled(Row)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
`;

export const RelativeRow = styled(Row)`
  position: relative;
  z-index: 1;
`;

export const InfoWrapper = styled.div`
  padding: 7.5rem 1rem 12rem;
`;

export const InfoBackground = styled.div`
  background: ${({theme}) => hexToRgba(theme.colors.text.default, 0.025)};
  width: 100%;
  height: 100%;
`;

export const LectureImage = styled.div<{url: string}>`
  width: 100%;
  padding-top: 56.25%;
  background: no-repeat center/cover url(${({url}) => url}) #000;
  position: relative;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    right: -0.5rem;
    bottom: -0.5rem;
    z-index: -1;
    display: block;
    background: ${({theme}) => theme.colors.accent};
  }
`;

export const LectureTitle = styled.h1`
  font-size: 3.375rem;
  font-weight: 700;
  white-space: pre-line;
  margin-bottom: 1rem;
`;

export const LectureDescription = styled.p`
  font-size: 1.125rem;
  color: ${({theme}) => theme.colors.text.caption};
  margin-bottom: 1.75rem;
`;

export const UploaderWrapper = styled.div`
  display: flex;
`;

export const UploaderName = styled.p`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({theme}) => theme.colors.text.default};
`;

export const UploaderJob = styled.p`
  font-size: 1rem;
  color: ${({theme}) => theme.colors.text.caption};
`;

export const UploaderProfileImage = styled.div<{url: string}>`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 3rem;
  background: no-repeat center/cover url(${({url}) => url});
  margin-right: 1rem;
`;

export const LectureUploadInfoContainer = styled.div`
  position: relative;
  margin-top: -220px;
  left: 15px;
`;

export const LectureUploadInfoTitle = styled.p`
  font-size: 1rem;
  color: rgba(51, 58, 61, 0.55);
`;

export const LectureUploadInfoDate = styled.p`
  font-size: 1.375rem;
  color: black;
  font-weight: 700;
`;
