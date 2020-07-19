import React from 'react';
import { Row, Col } from 'react-grid-system';
import Lesson from '@shared/src/entity/Lesson';

import CTAButton from '@src/components/common/CTAButton';

import * as S from './styles';
import FlatButton from '@src/components/common/FlatButton';

interface LectureLessonListProps {
  lessons: Lesson[];
}

const LectureLessonList: React.FC<LectureLessonListProps> = ({ lessons }) => {
  return (
    <S.ListContainer>
      <Row>
        <Col md={6}>
          <S.ListTitle>
            차시 목록
          </S.ListTitle>
        </Col>
        <Col md={6}>
          <S.AddLessonButtonContainer>
            <CTAButton>추가</CTAButton>
          </S.AddLessonButtonContainer>
        </Col>
      </Row>
      {lessons.map(({ id, name, description, duration }, index) => (
        <S.ItemWrapperRow 
          key={id}
          align="center"
        >
          <Col sm={1}>
            <S.LessonIndex>{index}</S.LessonIndex>
          </Col>
          <Col sm={9}>
            <S.LessonTitle>{name}</S.LessonTitle>
            <S.MetaWrapper>
              <p>{description}</p>
              <p>{duration}</p>
            </S.MetaWrapper>
          </Col>
          <Col sm={2}>
            {/*<S.PlayButton />*/}
            <S.EditButtonContainer>
              <FlatButton>수정</FlatButton>
            </S.EditButtonContainer>
          </Col>
        </S.ItemWrapperRow>
      ))}
    </S.ListContainer>
  );
};

export default LectureLessonList;
