import React, {ReactNode} from 'react';
import Lecture from '@shared/src/entity/Lecture';
import {CardContainer} from '@src/components/Lecture/LectureCardList/styles';
import {Col, Row} from 'react-grid-system';
import Router from 'next/router';

import * as S from './styles';
import {CompleteTag, DraftTag, ProcessingTag} from '@src/components/common/Tag/Tag';

interface LectureCardListProps {
  isManageMode?: boolean;
  lectures: Lecture[];
}

const LectureCardList: React.FC<LectureCardListProps> = ({ lectures, isManageMode = false }) => {
  const cards: ReactNode[] = [];

  lectures.map((lecture) => {
    cards.push(
      <Col md={4}
        onClick={() => gotoLectureInfo(lecture._id!)}
      >
        <S.Card>
          <S.LectureImage url={lecture.mainImageUrl!} />
          <S.TextArea>
            {getStatusTag(isManageMode, lecture)}
            <S.LectureCardTitle>{lecture.title}</S.LectureCardTitle>
            <S.BottomArea>
              <Row>
                <Col md={6}>
                  <S.BottomText>총 {lecture.lessons!.length}차시</S.BottomText>
                </Col>
                <Col md={6}>
                  <S.BottomText>{getFormatDate(lecture.uploadedAt)} 게시됨</S.BottomText>
                </Col>
              </Row>
            </S.BottomArea>
          </S.TextArea>
        </S.Card></Col>);
  });

  return (
    <CardContainer>
      <Row>
        {cards}
        {isManageMode && <Col md={4}>
          <S.AddCard>
            <S.AddIcon />
            <S.AddLectureText>새로운 강의 제작하기</S.AddLectureText>
          </S.AddCard>
        </Col>}
      </Row>
    </CardContainer>
  );
};

const gotoLectureInfo = (lectureId: string) => {
  Router.push({
    pathname: `/lecture/${lectureId!}`,
  });
};

const getFormatDate = (date: Date) => {
  const year = date.getFullYear();
  let month: number | string = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  let day: number | string = date.getDate();
  day = day >= 10 ? day : '0' + day;
  return  year + '.' + month + '.' + day;
};

const getStatusTag = (isManageMode: boolean, lecture: Lecture): ReactNode => {
  if (isManageMode) {
    if (lecture.isDraft) {
      return <DraftTag>DRAFT</DraftTag>;
    } else {
      if (lecture.isComplete) {
        return <CompleteTag>완료됨</CompleteTag>;
      }

      return <ProcessingTag>진행중</ProcessingTag>;
    }
  } else {
    if (lecture.isComplete) {
      return <CompleteTag>수강완료</CompleteTag>;
    }

    return <ProcessingTag>수강중</ProcessingTag>;
  }
};

export default LectureCardList;
