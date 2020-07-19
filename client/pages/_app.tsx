import { AppContext } from 'next/app';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@src/styles/theme';
import setGridSystem from '@src/styles/setGridSystem';
import fontLoader from '@src/styles/fontLoader';
import GlobalStyles from '@src/styles/globalStyles';
import SEO from '@src/components/common/SEO';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {useRouter} from 'next/router';
import {gotoMain, isLoggedIn} from '@src/utils/Login';

const MyApp: React.FC<AppContext> = ({ Component }) => {
  setGridSystem();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn() && router.route != '/') {
      gotoMain();
    }
  }, [router.route]);

  useEffect(() => {
    fontLoader({
      fontName: 'Spoqa Han Sans',
      href: '/fonts/spoqa-han-sans.css',
    });
    fontLoader({
      fontName: 'KoPub Batang',
      href: '/fonts/kopub-batang.css',
    });

    initializeFirebaseApp();
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

const initializeFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: process.env.GOOGLE_FIREBASE_API_KEY,
    authDomain: process.env.GOOGLE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.GOOGLE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.GOOGLE_FIREBASE_STORAGE_BUCKET,
    appId: process.env.GOOGLE_FIREBASE_APP_ID,
    measurementId: process.env.GOOGLE_FIREBASE_MEASUREMENT_ID,
  };

  firebase.initializeApp(firebaseConfig);
};

export default MyApp;
