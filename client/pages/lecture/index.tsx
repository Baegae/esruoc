import Layout from '@src/components/common/Layout';
import React from 'react';
import {Col, Container, Row} from 'react-grid-system';
import TitleSection from '@src/components/common/TitleSection';
import LectureCardList from '@src/components/Lecture/LectureCardList/LectureCardList';

export default () => (
  <Layout>
    <Container>
      <TitleSection title="수강 중인 강의"
        description="최근에 수강한 내역이 있거나, 수강 완료한 차시들을 확인해보세요."
      />
      <LectureCardList lectures={[
        {
          _id: 'myLecture1',
          title: '차세대 스캐터인들을 위한 DEV-101',
          description: '설명설명설명설명설명설명설명설명설명',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: true,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture2',
          title: '차세대 스캐터인들을 위한 DEV-101 두번쨰',
          description: '설명설명설명설명설명설명설명설명설명 2',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture3',
          title: '차세대 스캐터인들을 위한 DEV-101 세번째',
          description: '설명설명설명설명설명설명설명설명설명 3',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture4',
          title: '차세대 스캐터인들을 위한 DEV-101 네번째',
          description: '설명설명설명설명설명설명설명설명설명 4',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: true,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        }
      ]}
      />
    </Container>
    <Container style={{paddingTop: '50px'}}>
      <TitleSection title="이런 강의도 있어요!"
        description=""
      />
      <LectureCardList lectures={[
        {
          _id: 'myLecture1',
          title: '차세대 스캐터인들을 위한 DEV-101',
          description: '설명설명설명설명설명설명설명설명설명',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: true,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture2',
          title: '차세대 스캐터인들을 위한 DEV-101 두번쨰',
          description: '설명설명설명설명설명설명설명설명설명 2',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture3',
          title: '차세대 스캐터인들을 위한 DEV-101 세번째',
          description: '설명설명설명설명설명설명설명설명설명 3',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: false,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        },
        {
          _id: 'myLecture4',
          title: '차세대 스캐터인들을 위한 DEV-101 네번째',
          description: '설명설명설명설명설명설명설명설명설명 4',
          uploaderId: '이상훈',
          lessons: new Array(24).fill(null),
          isDraft: false,
          isComplete: true,
          uploadedAt: new Date(),
          mainImageUrl: 'https://source.unsplash.com/random/1920x1080',
        }
      ]}
      />
    </Container>
  </Layout>
);
