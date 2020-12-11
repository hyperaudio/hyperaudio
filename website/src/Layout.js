import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Footer from 'src/components/Footer';
import Topbar from 'src/components/Topbar';

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
  return (
    <>
      <div className={classes.content}>
        <Topbar />
        <Container>{children}</Container>
      </div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </>
  );
}
