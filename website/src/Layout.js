import React from 'react';

import Container from '@material-ui/core/Container';

import Footer from './components/Footer';
import Topbar from './components/Topbar';

export default function Layout({ children }) {
  return (
    <>
      <Topbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
