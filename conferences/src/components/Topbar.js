import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Auth, DataStore, syncExpression } from 'aws-amplify';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';

import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NoSsr from '@mui/material/NoSsr';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import VideocamIcon from '@mui/icons-material/Videocam';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import { User } from '../models';
import Link from './MuiNextLink';

const PREFIX = `Topbar`;
const classes = {
  root: `${PREFIX}-root`,
  fab: `${PREFIX}-fab`,
  menuItem: `${PREFIX}-menuItem`,
  avatar: `${PREFIX}-avatar`,
};

const Root = styled(AppBar, {
  shouldForwardProp: prop => prop !== 'user',
})(({ theme, user }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  [`.${classes.fab}`]: {
    backgroundColor: deepPurple[user ? 400 : 500],
    border: `1px solid ${deepPurple[user ? 300 : 400]}`,
    borderRadius: theme.shape.borderRadius * 6,
    color: theme.palette.primary.contrastText,
    height: 'auto',
    padding: theme.spacing(0.75),
    transition: `all ${theme.transitions.duration.standard}`,
    '&:hover': {
      backgroundColor: deepPurple[user ? 300 : 400],
    },
  },
  [`.${classes.avatar}`]: {
    ...theme.typography.caption,
    backgroundColor: deepPurple[user ? 500 : 400],
    color: deepPurple[100],
    fontWeight: 500,
    height: '30px',
    width: '30px',
  },
  [`.${classes.menuItem}`]: {
    padding: theme.spacing(1.25, 2),
    textAlign: 'left',
  },
}));

// const getUser = async (setUser, identityId) => {
//   DataStore.configure({
//     syncExpressions: [
//       syncExpression(User, () => {
//         return user => user.identityId('eq', identityId);
//       }),
//     ],
//   });

//   const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
//   setUser(Array.isArray(user) ? user[0] : user);
// };

const Topbar = props => {
  const router = useRouter();
  // const [user, setUser] = useState(props.user ? deserializeModel(User, props.user) : null);
  const { user, groups } = props;

  const logoutToHomePage = useCallback(async () => {
    await Auth.signOut({ global: true });
    window.location.href = '/';
  }, []);

  // const meh = useMemo(() => user, [user]);
  // console.group('Topbar');
  // console.log({ props });
  // console.log({ meh });
  // console.log({ user });
  // console.groupEnd();

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState(null);

  const openAddMenu = Boolean(addMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openAccountMenu = Boolean(accountMenuAnchor);

  const organization = {
    // TODO: Load real time org data
    name: 'Mozilla Festival 2022',
    slug: '/',
  };

  const title = ''; // TODO: Grab page title

  const [fname, lname] = useMemo(() => (user?.name ? [...user.name.split(' '), ''] : ['', '']), [user]);

  const menuProps = {
    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    transformOrigin: { horizontal: 'right', vertical: 'top' },
    disablePortal: true,
    variant: 'menu',
  };
  const primaryTypographyProps = {
    color: 'primary',
    gutterBottom: true,
    sx: { fontWeight: '600' },
  };
  const secondaryTypographyProps = {
    variant: 'caption',
  };
  const buttonLabelProps = {
    sx: { display: { xs: 'none', md: 'inline-block' }, mx: 1 },
  };

  return (
    <NoSsr>
      <Root position="fixed" elevation={12} className={classes.root} user={user}>
        <Toolbar sx={{ px: { xs: 1, md: 2 } }}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Fab
                aria-label="Return home"
                className={classes.fab}
                component={Link}
                href={user ? '/dashboard' : '/'}
                size="small"
                variant="extended"
              >
                <Avatar className={classes.avatar}>MF</Avatar> <Box {...buttonLabelProps}>{organization.name}</Box>
              </Fab>
              {user && (
                <>
                  <Tooltip title="More…">
                    <IconButton
                      aria-expanded={openOrgMenu ? 'true' : undefined}
                      aria-haspopup="true"
                      aria-label="Event options"
                      className={classes.fab}
                      color="inherit"
                      id="openOrgMenuButton"
                      onClick={e => setOrgMenuAnchor(e.currentTarget)}
                      sx={{ ml: { xs: 1, md: 1.5 } }}
                    >
                      <ArrowDropDownIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    {...menuProps}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    MenuListProps={{ 'aria-labelledby': 'openOrgMenuButton', dense: true }}
                    anchorEl={orgMenuAnchor}
                    id="orgMenu"
                    onClose={() => setOrgMenuAnchor(null)}
                    open={openOrgMenu}
                  >
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      href="/"
                      onClick={() => setOrgMenuAnchor(null)}
                    >
                      <ListItemIcon>
                        <HomeIcon sx={{ color: 'primary.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Home page"
                        primaryTypographyProps={primaryTypographyProps}
                        secondary="Preview your event home page"
                        secondaryTypographyProps={secondaryTypographyProps}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      href="/organization"
                      onClick={() => setOrgMenuAnchor(null)}
                    >
                      <ListItemIcon>
                        <SettingsIcon sx={{ color: 'primary.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Settings"
                        primaryTypographyProps={primaryTypographyProps}
                        secondary="Edit event details, members & more…"
                        secondaryTypographyProps={secondaryTypographyProps}
                      />
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Grid>
            <Grid item xs={6} align="right">
              {user ? (
                <>
                  <Tooltip title="New…">
                    <IconButton
                      aria-expanded={openAddMenu ? 'true' : undefined}
                      aria-haspopup="true"
                      aria-label="New…"
                      className={classes.fab}
                      color="inherit"
                      id="openAddMenuButton"
                      onClick={e => setAddMenuAnchor(e.currentTarget)}
                      sx={{ mr: { xs: 1, md: 1.5 } }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    {...menuProps}
                    anchorEl={addMenuAnchor}
                    id="addMenu"
                    MenuListProps={{
                      'aria-labelledby': 'openAddMenuButton',
                      dense: true,
                    }}
                    onClose={() => setAddMenuAnchor(null)}
                    open={openAddMenu}
                  >
                    <MenuItem className={classes.menuItem} onClick={() => setAddMenuAnchor(null)}>
                      <ListItemIcon>
                        <VideocamIcon sx={{ color: 'primary.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="New media"
                        primaryTypographyProps={primaryTypographyProps}
                        secondary="Upload or add new media"
                        secondaryTypographyProps={secondaryTypographyProps}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem className={classes.menuItem} onClick={() => setAddMenuAnchor(null)}>
                      <ListItemIcon>
                        <LibraryAddIcon sx={{ color: 'primary.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="New channel"
                        primaryTypographyProps={primaryTypographyProps}
                        secondary="Create new channel to assign media to"
                        secondaryTypographyProps={secondaryTypographyProps}
                      />
                    </MenuItem>
                  </Menu>
                  <Fab
                    aria-expanded={openAccountMenu ? 'true' : undefined}
                    aria-haspopup="true"
                    aria-label="Account"
                    className={classes.fab}
                    id="openAccountMenuButton"
                    onClick={e => setAccountMenuAnchor(e.currentTarget)}
                    size="small"
                    variant="extended"
                  >
                    <Avatar className={classes.avatar} alt={user?.name}>
                      {user.name.charAt(0)}
                    </Avatar>{' '}
                    <Box {...buttonLabelProps}>{user.name}</Box>
                    <ArrowDropDownIcon fontSize="small" sx={{ mx: 0.5 }} />
                  </Fab>
                  <Menu
                    {...menuProps}
                    anchorEl={accountMenuAnchor}
                    id="accountMenu"
                    MenuListProps={{
                      'aria-labelledby': 'openAccountMenuButton',
                      dense: true,
                    }}
                    onClose={() => setAccountMenuAnchor(null)}
                    open={openAccountMenu}
                  >
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      href="/account"
                      onClick={() => setAccountMenuAnchor(null)}
                    >
                      <ListItemIcon>
                        <PersonIcon sx={{ color: 'primary.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="My account"
                        primaryTypographyProps={primaryTypographyProps}
                        secondary="Account & security options…"
                        secondaryTypographyProps={secondaryTypographyProps}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => {
                        setAccountMenuAnchor(null);
                        logoutToHomePage();
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: 'error.light' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Log out"
                        primaryTypographyProps={{ ...primaryTypographyProps, color: 'error' }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              ) : false ? (
                <Fab aria-label="Authenticate" className={classes.fab} component={Link} href="/auth" variant="extended">
                  <Avatar className={classes.avatar}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box {...buttonLabelProps}>Sign in</Box>
                  <LoginIcon fontSize="small" sx={{ mx: 0.5 }} />
                </Fab>
              ) : null}
            </Grid>
          </Grid>
        </Toolbar>
      </Root>
      <Toolbar />
    </NoSsr>
  );
};

export default Topbar;
