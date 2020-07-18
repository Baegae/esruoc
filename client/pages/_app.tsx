import { AppContext } from 'next/app';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@src/styles/theme';
import setGridSystem from '@src/styles/setGridSystem';
import fontLoader from '@src/styles/fontLoader';
import GlobalStyles from '@src/styles/globalStyles';
import SEO from '@src/components/common/SEO';

const MyApp: React.FC<AppContext> = ({ Component }) => {
  setGridSystem();

  useEffect(() => {
    fontLoader({
      fontName: 'Spoqa Han Sans',
      href: '/fonts/spoqa-han-sans.css',
    });
    fontLoader({
      fontName: 'KoPub Batang',
      href: '/fonts/kopub-batang.css',
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <SEO />
        <Component />
      </>
    </ThemeProvider>
  );
};

export default MyApp;
