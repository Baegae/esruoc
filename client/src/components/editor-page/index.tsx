import React from 'react';
import EditorToolBar from '@src/components/editor-page/EditorToolBar';
import { RecoilRoot } from 'recoil';
import VideoEdit from '../VideoEdit';


export default () => (
  <div>
    <RecoilRoot>
      <EditorToolBar
        name="비디오 테스트"
        lectureName="강의 이름"
      />
      <div style={{ height: 120 }} />
      <VideoEdit />
    </RecoilRoot>
  </div>
);
