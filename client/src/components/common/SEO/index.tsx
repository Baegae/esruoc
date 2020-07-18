import React from 'react';
import Head from 'next/head';

const SEO:React.FC = () => {
  return (
    <Head>
      <title>Esruoc | Build your own course</title>
      <link 
        rel="shortcut icon"
        href="/favicon.ico"
        type="image/x-icon"
      />
      <link 
        rel="icon"
        href="/favicon.ico"
        type="image/x-icon"
      />
      <link 
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link 
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest"
        href="/site.webmanifest"
      />
      <meta 
        property="og:title"
        content="Esruoc"
      />
      <meta 
        property="og:site_name"
        content="Esruoc"
      />
      <meta 
        property="og:url"
        content=""
      />
      <meta 
        property="og:description"
        content="Build your own course. Time to say goodbye to old way."
      />
      <meta 
        property="og:type"
        content="website"
      />
      <meta 
        property="og:image"
        content="/og-image.png"
      />
    </Head>
  );
};

export default SEO;
