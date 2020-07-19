import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Row, Col } from 'react-grid-system';
import Lesson from '@shared/src/entity/Lesson';

import CTAButton from '@src/components/common/CTAButton';

import * as S from './styles';
import FlatButton from '@src/components/common/FlatButton';

interface LectureLessonListProps {
  lessons: Lesson[];
  isManageMode?: boolean;
}

const LectureLessonList: React.FC<LectureLessonListProps> = ({ lessons, isManageMode = false }) => {
  const router = useRouter();

  return (
    <S.ListContainer>
      <Row>
        <Col md={6}>
          <S.ListTitle>
            차시 목록
          </S.ListTitle>
        </Col>
        {isManageMode && <Col md={6}>
          <S.AddLessonButtonContainer>
            <CTAButton>추가</CTAButton>
          </S.AddLessonButtonContainer>
        </Col>}
      </Row>
      {lessons.map(({ id, title, description, duration }, index) => (
        <S.ItemWrapperRow 
          key={index}
          align="center"
        >
          <Col sm={1}>
            <S.LessonIndex>{index + 1}</S.LessonIndex>
          </Col>
          <Col sm={9}>
            <S.LessonTitle>{title}</S.LessonTitle>
            <S.MetaWrapper>
              <p>{description}</p>
              <p>{duration}</p>
            </S.MetaWrapper>
          </Col>
          <Col sm={2}>
            {!isManageMode && <S.PlayButton />}
            {isManageMode && <S.EditButtonContainer>
              <FlatButton>수정</FlatButton>
            </S.EditButtonContainer>}
          </Col>
        </S.ItemWrapperRow>
      ))}
    </S.ListContainer>
  );
};

export default LectureLessonList;
