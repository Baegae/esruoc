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
    axiosInstance.get('/lecture').then((result) => {
      setLectures(result.data.lectures);
    });
  }, []);

  return (<Layout>
    <Container>
      <TitleSection title="수강 중인 강의"
        description="최근에 수강한 내역이 있거나, 수강 완료한 차시들을 확인해보세요."
      />
      <LectureCardList lectures={lectures!.filter((lecture) => (lecture as any).isTaking)}/>
    </Container>
    <Container style={{paddingTop: '50px'}}>
      <TitleSection title="이런 강의도 있어요!"
        description=""
      />
      <LectureCardList lectures={lectures!.filter((lecture) => !(lecture as any).isTaking)} />
    </Container>
  </Layout>);
};

export default LecturePage;
