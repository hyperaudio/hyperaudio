import Footer from 'src/components/Footer';
import Topbar from 'src/components/Topbar';

export default function Layout({ children }) {
  return (
    <>
      <Topbar />
      {children}
      <Footer />
    </>
  );
}
