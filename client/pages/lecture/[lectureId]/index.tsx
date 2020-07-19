import React, {useEffect, useState} from 'react';
import Layout from '@src/components/common/Layout';
import LectureInfoHeader from '@src/components/Lecture/LectureInfoHeader';
import LectureLessonList from '@src/components/Lecture/LectureLessonList';
import {useRouter} from 'next/router';
import Lesson from '@shared/src/entity/Lesson';
import axiosInstance from '@src/utils/ApiRequest';
import Lecture from '@shared/src/entity/Lecture';

const LectureDetailPage: React.FC = () => {
  const router = useRouter();
  const { lectureId } = router.query;

  const [lecture, setLecture] = useState<Lecture>();

  useEffect(() => {
    if (lectureId) {
      axiosInstance.get(`/lecture/${lectureId}`).then((result) => {
        if (result) {
          setLecture(result.data);
        } else {
          alert('없는 강의 입니다.');
          router.back();
        }
      }).catch((error) => {
        alert('없는 강의 입니다.');
        router.back();
      });
    }
  }, [lectureId]);

  return (
    <Layout>
      {lecture && <div>
        <LectureInfoHeader {...lecture} />
        <LectureLessonList lessons={lecture!.lessons!}
          isManageMode={lecture.uploadedByMe}
        />
      </div>}
    </Layout>
  );
};

export default LectureDetailPage;
