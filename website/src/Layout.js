import Container from '@material-ui/core/Container';

import Footer from 'src/components/Footer';
import Topbar from 'src/components/Topbar';

const Layout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
