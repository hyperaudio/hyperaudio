import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Auth, DataStore, syncExpression } from 'aws-amplify';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';

import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NoSsr from '@mui/material/NoSsr';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import { styled } from '@mui/material/styles';

import { User } from '../models';

const PREFIX = `Topbar`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [`& .MuiAvatar-root`]: {
    fontSize: '1em !important',
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 1,
  },
}));

const getUser = async (setUser, identityId) => {
  DataStore.configure({
    syncExpressions: [
      syncExpression(User, () => {
        return user => user.identityId('eq', identityId);
      }),
    ],
  });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  setUser(Array.isArray(user) ? user[0] : user);
};

const Topbar = props => {
  const router = useRouter();

  const { identityId } = props;
  const [user, setUser] = useState(props.user ? deserializeModel(User, props.user) : null);

  useEffect(() => identityId && getUser(setUser, identityId), [identityId]);

  useEffect(() => {
    const subscription = DataStore.observe(User).subscribe(() => identityId && getUser(setUser, identityId));
    return () => subscription.unsubscribe();
  }, [identityId]);

  const navigateToAccountPage = useCallback(() => router.push('/account'), [router]);
  const logoutToHomePage = useCallback(async () => {
    await Auth.signOut({ global: true });
    window.location.href = '/';
  }, []);

  const meh = useMemo(() => user, [user]);

  // console.group('Topbar');
  // console.log({ props });
  // console.log({ meh });
  // console.log({ user });
  // console.groupEnd();

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const openAddMenu = Boolean(addMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openProfileMenu = Boolean(profileMenuAnchor);

  const organization = {
    // TODO: Load real time org data
    name: 'Mozilla Festival',
    slug: '/',
  };

  const title = ''; // TODO: Grab page title

  const userName = 'Monsiuer Pieutre';
  const [fname, lname] = useMemo(() => (userName ? [...userName.split(' '), ''] : ['', '']), [user]);

  return (
    <NoSsr>
      <Root position="fixed" elevation={0} className={classes.root}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Button
                onClick={e => setOrgMenuAnchor(e.currentTarget)}
                size="small"
                color="primary"
                startIcon={
                  <Avatar sx={{ height: 28, width: 28 }} alt={organization.name}>
                    {organization.name.charAt(0)}
                  </Avatar>
                }
              >
                {' '}
                <Hidden mdDown>{organization.name}</Hidden>
                <ArrowDropDownIcon fontSize="small" />
              </Button>
              <Tooltip title="Open your organization’s home page">
                <IconButton
                  color="primary"
                  edge="end"
                  href={organization.slug}
                  sx={{ marginLeft: 1 }}
                  target="_blank"
                  variant="contained"
                >
                  <HomeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={4} align="center">
              <Typography variant="h6" sx={{ fontSize: '1.11rem' }} color="primary">
                {title}
              </Typography>
            </Grid>
            <Grid item xs={4} align="right">
              <Tooltip title="Add new…">
                <IconButton
                  aria-expanded={openAddMenu ? 'true' : undefined}
                  aria-haspopup="true"
                  aria-label="Add new…"
                  color="primary"
                  edge="start"
                  id="openAddMenuButton"
                  onClick={e => setAddMenuAnchor(e.currentTarget)}
                  sx={{ marginRight: 1 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                onClick={e => setProfileMenuAnchor(e.currentTarget)}
                color="primary"
                size="small"
                startIcon={
                  <Avatar sx={{ height: 30, width: 30 }} alt={user?.name}>
                    {fname.charAt(0)} {lname.charAt(0)}
                  </Avatar>
                }
              >
                {' '}
                <Hidden mdDown>
                  {fname} {`${lname.charAt(0)}${lname.charAt(0) !== '' ? '.' : ''}`}
                </Hidden>{' '}
                <ArrowDropDownIcon fontSize="small" />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </Root>
      <Toolbar />
      <Menu
        anchorEl={addMenuAnchor}
        id="addMenu"
        MenuListProps={{
          'aria-labelledby': 'openAddMenuButton',
          dense: true,
        }}
        onClose={() => setAddMenuAnchor(null)}
        open={openAddMenu}
        variant="menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <VideocamIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>New media…</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <LibraryAddIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>New channel…</ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={profileMenuAnchor}
        id="profileMenu"
        MenuListProps={{
          'aria-labelledby': 'openProfileMenuButton',
          dense: true,
        }}
        onClose={() => setProfileMenuAnchor(null)}
        open={openProfileMenu}
        variant="menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <PersonIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }} onClick={navigateToAccountPage}>
            My account
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <LogoutIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }} onClick={logoutToHomePage}>
            Log out
          </ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={orgMenuAnchor}
        id="orgMenu"
        MenuListProps={{
          'aria-labelledby': 'openOrgMenuButton',
          dense: true,
        }}
        onClose={() => setOrgMenuAnchor(null)}
        open={openOrgMenu}
        variant="menu"
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setOrgMenuAnchor(null)}>
          <ListItemIcon>
            <SettingsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>Organization settings</ListItemText>
        </MenuItem>
      </Menu>
    </NoSsr>
  );
};

export default Topbar;
