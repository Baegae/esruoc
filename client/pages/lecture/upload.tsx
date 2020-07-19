import Layout from '@src/components/common/Layout';
import React, {useEffect, useState} from 'react';
import {Container} from 'react-grid-system';
import TitleSection from '@src/components/common/TitleSection';
import LectureCardList from '@src/components/Lecture/LectureCardList/LectureCardList';
import axiosInstance from '@src/utils/ApiRequest';
import Lecture from '@shared/src/entity/Lecture';

const LecturePage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    axiosInstance.get('/lecture/my').then((result) => {
      setLectures(result.data.lectures);
    });
  }, []);

  return (<Layout>
    <Container>
      <TitleSection title="내가 만든 강의"
        description="새로운 강의를 만들거나, 제작한 강의들을 관리하세요."
      />
      <LectureCardList lectures={lectures!}/>
    </Container>
  </Layout>);
};

export default LecturePage;
