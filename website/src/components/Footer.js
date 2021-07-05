import NextLink from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';

import HyperaudioIcon from 'src/assets/icons/HaIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
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
        <Button
          className={classes.brandmark}
          color="primary"
          component="a"
          href="https://hyper.audio"
          startIcon={<HyperaudioIcon />}
        >
          hyperaudio
        </Button>
      </div>
      <div className={classes.content}>
        <NextLink href="/blog" passHref>
          <Link color="textSecondary" variant="caption">
            Blog
          </Link>
        </NextLink>
        <NextLink href="/TOS" passHref>
          <Link color="textSecondary" variant="caption">
            Terms of Service
          </Link>
        </NextLink>
        <NextLink href="/Licensing" passHref>
          <Link color="textSecondary" variant="caption">
            License
          </Link>
        </NextLink>
        <NextLink href="/CLA" passHref>
          <Link color="textSecondary" variant="caption">
            CLA
          </Link>
        </NextLink>
        <NextLink href="/COC" passHref>
          <Link color="textSecondary" variant="caption">
            Code of Conduct
          </Link>
        </NextLink>
      </div>
    </AppBar>
  );
}
