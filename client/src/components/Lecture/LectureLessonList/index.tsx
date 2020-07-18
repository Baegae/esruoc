import React from 'react';
import { Row, Col } from 'react-grid-system';
import Lesson from '@shared/src/entity/Lesson';

import * as S from './styles';

interface LectureLessonListProps {
  lessons: Lesson[];
}

const LectureLessonList: React.FC<LectureLessonListProps> = ({ lessons }) => {
  return (
    <S.ListContainer>
      <Row>
        <Col>
          <S.ListTitle>
            차시 목록
          </S.ListTitle>
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
            <button>play</button>
          </Col>
        </S.ItemWrapperRow>
      ))}
    </S.ListContainer>
  );
};

export default LectureLessonList;
