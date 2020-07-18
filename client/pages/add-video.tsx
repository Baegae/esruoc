import React from 'react';
import dynamic from 'next/dynamic';
import EditorToolBar from '@src/components/editor-page/EditorToolBar';

const VideoEditTest = dynamic(() => import('../src/components/VideoEdit'), {
  ssr: false,
});

export default () => (
  <div>
    <EditorToolBar
      name="비디오 테스트"
      lectureName="강의 이름"
    />
    <div style={{height: 120}} />
    <VideoEditTest />
  </div>
);
