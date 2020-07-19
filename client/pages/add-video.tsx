import React from 'react';
import dynamic from 'next/dynamic';

const EditorPage = dynamic(() => import('../src/components/editor-page'), {
  ssr: false,
});

export default () => (
  <EditorPage />
);
