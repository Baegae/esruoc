import React from 'react';
// import { useRouter } from 'next/router';
import Layout from '@src/components/common/Layout';
import LectureInfoHeader from '@src/components/Lecture/LectureInfoHeader';
import Lecture from '@shared/src/entity/Lecture';
import LectureLessonList from '@src/components/Lecture/LectureLessonList';

const LectureDetailPage = () => {
  // TODO: 서버로 부터 강의 정보를 불러와야함
  // const router = useRouter();
  // const { lectureId } = router.query;
  const lectureData: Lecture = {
    title: '차세대 스캐터인들을\n위한 DEV-101',
    description: '누구나 코딩은 필요하죠. 한번 배워보면 어떨까요?',
    uploaderId: '김예준',
    lessons: [
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
      {
        id: 'id',
        title: '개발의 첫 걸음은 “Hello, World”',
        description:
          'Javascript로 ‘Hello, World!’ 를 출력해볼거에요. 안녕, 개발의 세계!',
        duration: 123123,
        content: '12312123123123312',
        videoUrl: '',
        uploadedAt: new Date(),
      },
    ],
    mainImageUrl: 'string',
  };
  return (
    <Layout>
      <LectureInfoHeader {...lectureData} />
      {!!lectureData.lessons && (
        <LectureLessonList lessons={lectureData.lessons} />
      )}
    </Layout>
  );
};

export default LectureDetailPage;
