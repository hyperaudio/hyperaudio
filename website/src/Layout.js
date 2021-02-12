import { useRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Footer from 'src/components/Footer';
import Topbar from 'src/components/Topbar';
import Hero from 'src/components/Hero';

import ORG from 'src/config/organization.json'; // TODO: Don’t just use JSON here, check for mozfest.hyper.audio?

const useStyles = makeStyles(() => ({
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
        <Topbar />
        {Boolean(ORG) && <Hero org={ORG} size={router.pathname === '/' ? 'large' : 'small'} />}
        <Container>{children}</Container>
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </>
  );
}
