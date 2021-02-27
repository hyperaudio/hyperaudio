import NextLink from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';

import HyperaudioIcon from 'src/assets/icons/HaIcon';

const useStyles = makeStyles(theme => ({
  root: {
    bottom: 0,
    left: 0,
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
    position: 'sticky',
    right: 0,
  },
  brand: {
    textAlign: 'center',
  },
  content: {
    textAlign: 'center',
    '& > *': {
      clear: 'both',
      display: 'inline-block',
      margin: theme.spacing(1),
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <AppBar className={classes.root} color="transparent" component="div" elevation={0} position="static">
      <div className={classes.brand}>
        <Button className={classes.brandmark} color="primary" startIcon={<HyperaudioIcon />}>
          hyperaudio
        </Button>
      </div>
      <div className={classes.content}>
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
      </div>
    </AppBar>
  );
}
