import React from 'react';
import dynamic from 'next/dynamic';

const EditorJSTestPage = dynamic(() => import('../src/components/EditorJSTest'), {
  ssr: false,
});

export default () => <EditorJSTestPage />;
