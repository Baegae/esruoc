import React from 'react';
import { useRouter } from 'next/router';
import EditorToolBar from '@src/components/editor-page/EditorToolBar';

const EditorPage: React.FC = () => {
  const router = useRouter();
  const { lectureId, lessonId } = router.query;
  return (
    <div>
      <EditorToolBar />
      <h1>Editor</h1>
      lectureId: {lectureId}, lessonId: {lessonId}
    </div>
  );
};

export default EditorPage;
