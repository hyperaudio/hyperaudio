/* eslint-disable no-shadow */
import React, { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

import HyperaudioIcon from 'src/assets/hyperaudio-icon.svg';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  push: {
    ...theme.mixins.toolbar,
  },
}));

const Topbar = () => {
  const classes = useStyles();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const [, setAuthState] = useState();
  const [user, setUser] = useState();

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

  const signOut = useCallback(async () => {
    Auth.signOut();
    router.reload();
  });

  const onMenuClick = useCallback((e, href) => {
    e.preventDefault();
    setAnchorEl(null);
    router.push(href);
  }, []);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="h1">
            <NextLink href="/" passHref>
              <Link color="inherit">
                <HyperaudioIcon />
              </Link>
            </NextLink>
          </Typography>
          <div className={classes.grow} />
          <NextLink href="/" passHref>
            <Button color="inherit" variant="text">
              Home
            </Button>
          </NextLink>
          <NextLink href="/media" passHref>
            <Button color="inherit" variant="text">
              Media
            </Button>
          </NextLink>
          <NextLink href="/mixes" passHref>
            <Button color="inherit" variant="text">
              Mixes
            </Button>
          </NextLink>
          <div className={classes.grow} />
          {user ? (
            <>
              <Tooltip title="More options…">
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  color="inherit"
                  edge="end"
                  onClick={e => setAnchorEl(e.currentTarget)}
                  variant="text"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

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
                <MenuItem onClick={e => onMenuClick(e, '/account')}>My account</MenuItem>
                <Divider className={classes.divider} />
                <MenuItem onClick={signOut}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <NextLink href={`/auth/?redirect=${router.asPath}`} passHref>
              <Button color="inherit" variant="text">
                Login
              </Button>
            </NextLink>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.push} />
    </>
  );
};

export default Topbar;
