import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import 'nprogress/nprogress.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Footer from 'src/components/Footer';
import Hero from 'src/components/Hero';
import Navbar from 'src/components/Navbar';
import Topbar from 'src/components/Topbar';
import useOrganization from 'src/hooks/useOrganization';

const TopProgressBar = dynamic(() => import('src/components/TopProgressBar'), { ssr: false });

const useStyles = makeStyles(theme => ({
  '@global': {
    'html, body': {
      backgroundColor: theme.palette.background.default,
      height: '100%',
    },
    '#nprogress .bar': {
      backgroundColor: theme.palette.primary.main,
      height: theme.spacing(0.5),
      zIndex: 10000,
    },
    '#nprogress .peg': {
      boxShadow: 'none',
    },
    '#__next': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    'video, video:focus': {
      outline: 'none',
    },
  },
}));

export default function Layout({ children }) {
  useStyles();
  const organization = useOrganization();
  const router = useRouter();

  return (
    <>
      <CssBaseline />
      <TopProgressBar />
      <Topbar />
      {organization && router.pathname === '/' && <Hero org={organization} />}
      {children}
      {router.pathname === '/' && <Footer />}
      <Navbar pathname={router.pathname} />
    </>
  );
}
