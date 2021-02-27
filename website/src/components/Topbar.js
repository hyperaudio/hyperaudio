/* eslint-disable no-shadow */
import NextLink from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { rgba } from 'polished';
import { useRouter } from 'next/router';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import HyperaudioIcon from 'src/assets/icons/HaIcon';
// import MozfestLogo from 'src/assets/mozfest-logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    background: rgba(theme.palette.background.default, theme.palette.background.defaultOpacity),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  push: {
    ...theme.mixins.toolbar,
  },
}));

const Topbar = ({ org }) => {
  const classes = useStyles();
  const router = useRouter();
  const trigger = useScrollTrigger();

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

  const signOut = useCallback(() => {
    (async () => {
      Auth.signOut();
      router.reload();
    })();
  }, [router]);

  const onMenuClick = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="fixed" color="transparent" className={classes.root} elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container alignItems="center" alignContent="center">
              <Grid item xs={3}>
                {router.pathname === '/' ? (
                  <NextLink href="/" passHref>
                    <IconButton color="primary" edge="start">
                      <HyperaudioIcon />
                    </IconButton>
                  </NextLink>
                ) : (
                  <NextLink href="/" passHref>
                    <IconButton color="primary" edge="start">
                      <ArrowBackIcon />
                    </IconButton>
                  </NextLink>
                )}
              </Grid>
              <Grid item container justify="center" alignItems="center" xs={6}>
                {Boolean(org?.logo) && <img src={org.logo} alt="Mozilla Festival" height="32" />}
                {/* <Typography component="h1" variant="button">
                  <NextLink href="/" passHref>
                    <Button color="primary" startIcon={<HyperaudioIcon />}>
                      hyperaudio
                    </Button>
                  </NextLink>
                </Typography> */}
                {/* <Hidden smDown> // TODO: Resurrect this
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
                </Hidden> */}
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
                  <>
                    {/* <NextLink href={`/auth/?redirect=${router.asPath}`} passHref>
                    <Button color="primary" variant="text">
                      Login
                    </Button>
                  </NextLink> */}
                  </>
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
};

export default Topbar;
