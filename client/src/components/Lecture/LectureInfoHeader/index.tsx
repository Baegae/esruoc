import React from 'react';
import {Container, Col, Row} from 'react-grid-system';
import Lecture from '@shared/src/entity/Lecture';

import * as S from './styles';

const LectureInfoHeader: React.FC<Lecture> = ({
  title,
  description,
  uploaderId,
  mainImageUrl,
  uploadedAt,
  uploader,
  lessonCount
}) => {
  return (
    <Container>
      <S.RelativeRow
        justify="between"
        align="center"
      >
        <Col sm={6}>
          <S.LectureImage url={mainImageUrl} />
        </Col>
        <Col sm={6}>
          <S.InfoWrapper>
            <S.LectureTitle>{title}</S.LectureTitle>
            <S.LectureDescription>{description}</S.LectureDescription>
            <S.UploaderWrapper>
              <S.UploaderProfileImage url={uploader.profileImageUrl} />
              <div>
                <S.UploaderName>{uploader.name}</S.UploaderName>
                <S.UploaderJob>프론트엔드 엔지니어</S.UploaderJob>
              </div>
            </S.UploaderWrapper>
          </S.InfoWrapper>
        </Col>
        <S.LectureSubInfoContainer>
          <Row>
            <Col sm={8}>
              <S.LectureSubTitle>강의 제작 날짜</S.LectureSubTitle>
              <S.LectureSubValue>{getFormatDate(uploadedAt)}</S.LectureSubValue>
            </Col>
            <Col sm={4}>
              <S.LectureSubTitle>총 차시</S.LectureSubTitle>
              <S.LectureSubValue>{lessonCount} 차시</S.LectureSubValue>
            </Col>
          </Row>
        </S.LectureSubInfoContainer>
      </S.RelativeRow>
      <S.AbsoluteRow justify="end">
        <Col sm={8}>
          <S.InfoBackground />
        </Col>
      </S.AbsoluteRow>
    </Container>
  );
};

const getFormatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  let month: number | string = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  return  year + '년 ' + month + '월';
};

export default LectureInfoHeader;
