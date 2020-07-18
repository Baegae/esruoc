import React from 'react';
import Navbar from '../Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
