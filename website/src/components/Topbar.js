import NextLink from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  push: {
    ...theme.mixins.toolbar,
  },
}));

export default function Topbar() {
  const classes = useStyles();
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="h1">
            <NextLink href="/" passHref>
              <Link color="textPrimary">Hyperaudio</Link>
            </NextLink>
          </Typography>
          <NextLink href="/blog" passHref>
            <Button variant="text">Blog</Button>
          </NextLink>
          <NextLink href="/mixes" passHref>
            <Button variant="text">Mixes</Button>
          </NextLink>
          <NextLink href="/media" passHref>
            <Button variant="text">Media</Button>
          </NextLink>
        </Toolbar>
      </AppBar>
      <div className={classes.push} />
    </>
  );
}
