import NextLink from 'next/link';

import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    top: 'auto',
    bottom: 0,
  },
  push: {
    ...theme.mixins.toolbar,
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.push} />
      <AppBar className={classes.root} color="transparent" elevation={0}>
        <Toolbar>
          <NextLink href="/TOS" passHref>
            <Link>Terms of Service</Link>
          </NextLink>
          <NextLink href="/Licensing" passHref>
            <Link>License</Link>
          </NextLink>
          <NextLink href="/blog" passHref>
            <Link>Blog</Link>
          </NextLink>
          <NextLink href="/CLA" passHref>
            <Link>CLA</Link>
          </NextLink>
          <NextLink href="/COC" passHref>
            <Link>Code of Conduct</Link>
          </NextLink>
        </Toolbar>
      </AppBar>
    </>
  );
}
