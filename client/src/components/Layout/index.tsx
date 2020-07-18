import React, { useEffect } from 'react';
import GlobalStyles from '@src/styles/globalStyles';
import fontLoader from '@src/styles/fontLoader';

interface LayoutProps {
  children: React.ReactChild | React.ReactChildren;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
    <>
      <GlobalStyles />
      {children}
    </>
  );
};

export default Layout;
