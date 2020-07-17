import React from 'react';
import dynamic from 'next/dynamic';

const VideoEditTest = dynamic(() => import('../src/components/VideoEditTest'), {
  ssr: false,
});


export default () => <VideoEditTest />;
