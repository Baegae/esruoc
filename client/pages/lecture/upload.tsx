import Layout from '@src/components/common/Layout';
import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-grid-system';
import TitleSection from '@src/components/common/TitleSection';
import LectureCardList from '@src/components/Lecture/LectureCardList/LectureCardList';
import axiosInstance from '@src/utils/ApiRequest';
import Lecture from '@shared/src/entity/Lecture';
import CTAButton from '@src/components/common/CTAButton';

import Modal from 'react-modal';
import styled from 'styled-components';

const ModalTitle = styled.p`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const SectionLabel = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const InputBox = styled.input`
  width: 100%;
  height: 40px;
  outline: none;
  border: 1px solid #f9d336;
  margin-bottom: 20px;
`;

const FileBox = styled.label`
  width: 100%;
  height: 40px;
  outline: none;
  border: 1px solid #f9d336;
  margin-bottom: 20px;
`;

const LecturePage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<Blob>();

  useEffect(() => {
    axiosInstance.get('/lecture/my').then((result) => {
      setLectures(result.data.lectures);
    });
  }, []);


  const createLecture = () => {
    setIsModalOpen(true);
  };

  const postLecture = () => {
    setIsModalOpen(false);

    const bodyFormData = new FormData();
    bodyFormData.set('title', title);
    bodyFormData.set('description', description);
    bodyFormData.append('mainImage', file![0]);

    axiosInstance.post('/lecture', bodyFormData, {
      headers: {
        'Content-Type': 'undefined'
      }
    }).then((result) => {
      console.log(result);
    });
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '700px',
      height: '480px',
    }
  };

  return (<Layout>
    <Container>
      <Row>
        <Col>
          <TitleSection title="내가 만든 강의"
            description="새로운 강의를 만들거나, 제작한 강의들을 관리하세요."
          />
        </Col>
        <Col>
          <div>
            <CTAButton onClick={() => createLecture()}
              style={{position: 'relative', marginTop: '80px', right: 0, float: 'right'}}
            >강의 만들기</CTAButton>
          </div>
        </Col>
      </Row>
      <LectureCardList lectures={lectures!}/>
    </Container>
    <Modal isOpen={isModalOpen}
      style={customStyles}
    >
      <div>
        <ModalTitle>강의 추가하기</ModalTitle>
        <SectionLabel>강의 제목</SectionLabel>
        <InputBox onChange={(e) => setTitle((e.target as any).value)}
          placeholder="강의 제목을 입력하세요."
        />
        <SectionLabel>강의 설명</SectionLabel>
        <InputBox onChange={(e) => setDescription((e.target as any).value)}
          placeholder="강의 설명을 입력하세요."
        />
        <SectionLabel>강의 메인 이미지</SectionLabel>
        <InputBox type="file"
          placeholder="강의 메인"
          onChange={(e) => setFile((e.target as any).files)}
        />
        <CTAButton onClick={() => postLecture()}
          style={{
            position: 'absolute',
            right: '0',
            bottom: '0',
            marginBottom: '25px',
            marginRight: '25px'
          }}
        >생성</CTAButton>
      </div>
    </Modal>
  </Layout>);
};

export default LecturePage;
