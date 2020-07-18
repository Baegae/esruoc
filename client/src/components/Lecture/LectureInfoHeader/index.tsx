import React from 'react';
import { Container, Col } from 'react-grid-system';
import Lecture from '@shared/src/entity/Lecture';

import * as S from './styles';

const LectureInfoHeader: React.FC<Lecture> = ({
  title,
  description,
  uploaderId,
}) => {
  return (
    <Container>
      <S.RelativeRow
        justify="between"
        align="center"
      >
        <Col sm={6}>
          <S.LectureImage url="https://source.unsplash.com/random/1920x1080" />
        </Col>
        <Col sm={6}>
          <S.InfoWrapper>
            <S.LectureTitle>{title}</S.LectureTitle>
            <S.LectureDescription>{description}</S.LectureDescription>
            <S.UploaderWrapper>
              <S.UploaderProfileImage url="https://source.unsplash.com/random/60x60" />
              <div>
                <S.UploaderName>{uploaderId}</S.UploaderName>
                <S.UploaderJob>프론트엔드 엔지니어</S.UploaderJob>
              </div>
            </S.UploaderWrapper>
          </S.InfoWrapper>
        </Col>
      </S.RelativeRow>
      <S.AbsoluteRow justify="end">
        <Col sm={8}>
          <S.InfoBackground />
        </Col>
      </S.AbsoluteRow>
    </Container>
  );
};

export default LectureInfoHeader;
