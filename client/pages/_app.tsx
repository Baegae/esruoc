import { AppContext } from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Layout from '@src/components/Layout';
import theme from '@src/styles/theme';

const MyApp: React.FC<AppContext> = ({ Component }) => (
  <ThemeProvider theme={theme}>
    <Layout>
      <Component />
    </Layout>
  </ThemeProvider>
);

export default MyApp;
