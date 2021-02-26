import { useRouter } from 'next/router';

// import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';

// import Navbar from 'src/components/Navbar';
import Footer from 'src/components/Footer';
import Topbar from 'src/components/Topbar';
import Hero from 'src/components/Hero';

import ORG from 'src/config/organization.json'; // TODO: Don’t just use JSON here, check for mozfest.hyper.audio?

const useStyles = makeStyles(theme => ({
  content: {
    flex: '1 0 auto',
  },
  footer: {
    flexShrink: '0',
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      <div className={classes.content}>
        <Topbar org={ORG} />
        {Boolean(ORG) && router.pathname === '/' && <Hero org={ORG} />}
        {children}
      </div>
      <div className={classes.footer}>
        <Footer />
        {/* <Navbar pathname={router.pathname} /> // TODO: Resurrect this */}
      </div>
    </>
  );
}
