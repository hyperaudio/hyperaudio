import NextLink from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  toolbar: {
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0, 1),
    },
  },
}));

const Footer = props => {
  const classes = useStyles();
  return (
    <AppBar className={classes.root} color="transparent" component="div" elevation={0} position="static">
      <Toolbar className={classes.toolbar} variant="dense">
        <NextLink href="/blog" passHref>
          <Link color="textSecondary">Blog</Link>
        </NextLink>
        <NextLink href="/TOS" passHref>
          <Link color="textSecondary">Terms of Service</Link>
        </NextLink>
        <NextLink href="/Licensing" passHref>
          <Link color="textSecondary">License</Link>
        </NextLink>
        <NextLink href="/CLA" passHref>
          <Link color="textSecondary">CLA</Link>
        </NextLink>
        <NextLink href="/COC" passHref>
          <Link color="textSecondary">Code of Conduct</Link>
        </NextLink>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
