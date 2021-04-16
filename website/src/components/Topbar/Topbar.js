/* eslint-disable no-shadow */
import NextLink from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { rgba } from 'polished';
import { useRouter } from 'next/router';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from '@material-ui/core/styles/makeStyles';

import HyperaudioIcon from 'src/assets/icons/HaIcon';

const useStyles = makeStyles(theme => ({
  root: {
    background: rgba(theme.palette.background.default, theme.palette.background.defaultOpacity),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  push: {
    ...theme.mixins.toolbar,
  },
  ...console.log({ theme }),
}));

export default function Topbar() {
  const classes = useStyles();
  const router = useRouter();

  const [, setAuthState] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [raised, setRaised] = React.useState(false);
  const [user, setUser] = useState();

  const handleScroll = () => setRaised(window?.scrollY > 10);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('User: ', user);
        setUser(user);
      })
      .catch(() => setUser(null));
  }, [setUser]);

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      console.log({ authData });
      setUser(authData);
    });
  }, [setAuthState, setUser]);

  useEffect(() => {
    window?.addEventListener('scroll', _.throttle(handleScroll, 350));
    return () => {
      window?.removeEventListener('scroll', _.throttle(handleScroll, 350));
    };
  }, []);

  const signOut = useCallback(() => {
    (async () => {
      Auth.signOut();
      router.reload();
    })();
  }, [router]);

  const onMenuClick = () => setAnchorEl(null);

  return (
    <>
      <AppBar className={classes.root} color="transparent" elevation={raised ? 1 : 0} position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container alignItems="center" alignContent="center">
              <Grid item xs={3}>
                <NextLink href="/" passHref>
                  <IconButton color="primary" edge="start">
                    <HyperaudioIcon />
                  </IconButton>
                </NextLink>
              </Grid>
              <Grid item container justify="center" alignItems="center" xs={6}>
                <Hidden smDown>
                  <NextLink href="/channels" passHref>
                    <Button color="primary" variant="text">
                      Channels
                    </Button>
                  </NextLink>
                  <NextLink href="/media" passHref>
                    <Button color="primary" variant="text">
                      Media
                    </Button>
                  </NextLink>
                  <NextLink href="/mixes" passHref>
                    <Button color="primary" variant="text">
                      Mixes
                    </Button>
                  </NextLink>
                </Hidden>
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'right' }}>
                {user ? (
                  <Tooltip title="More options…">
                    <span>
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        color="primary"
                        edge="end"
                        onClick={e => setAnchorEl(e.currentTarget)}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <NextLink href={`/auth/?redirect=${router.asPath}`} passHref>
                    <Button color="primary" variant="text">
                      Login
                    </Button>
                  </NextLink>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <div className={classes.push} />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
        id="simple-menu"
        keepMounted
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        variant="menu"
      >
        <span>
          <NextLink href="/account" passHref>
            <MenuItem dense onClick={onMenuClick}>
              My account
            </MenuItem>
          </NextLink>
        </span>
        <Divider className={classes.divider} />
        <MenuItem dense onClick={signOut}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
