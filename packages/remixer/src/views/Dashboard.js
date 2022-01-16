import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import FilterListIcon from '@mui/icons-material/FilterList';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import TuneIcon from '@mui/icons-material/Tune';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

const PREFIX = `Dashboard`;
const classes = {
  button: `${PREFIX}-button`,
  main: `${PREFIX}-main`,
  topbar: `${PREFIX}-topbar`,
};

const Root = styled(
  'div',
  {},
)(({ theme }) => ({
  [`& .${classes.button}`]: {
    // background: theme.palette.background.default,
  },
  [`& .${classes.main}`]: {
    padding: theme.spacing(8, 0),
  },
  [`& .${classes.topbar}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    // background: theme.palette.background.paper,
  },
}));

export function Dashboard(props) {
  const { channels, organization, account } = props;

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = React.useState(null);

  const openAddMenu = Boolean(addMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openProfileMenu = Boolean(profileMenuAnchor);
  const openSortMenu = Boolean(sortMenuAnchor);

  return (
    <Root>
      <AppBar position="fixed" elevation={0} className={classes.topbar}>
        <Toolbar>
          <Grid container>
            <Grid item>
              <Button
                className={classes.button}
                onClick={e => setOrgMenuAnchor(e.currentTarget)}
                size="small"
                color="inherit"
                startIcon={<Avatar sx={{ height: 30, width: 30 }} />}
              >
                {' '}
                {organization.name} <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
              </Button>
              <Tooltip title="Open home page">
                <IconButton
                  className={classes.button}
                  color="inherit"
                  edge="end"
                  size="large"
                  href={organization.slug}
                  target="_blank"
                  sx={{ marginLeft: 1 }}
                  variant="contained"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              <Tooltip title="Add new…">
                <IconButton
                  aria-expanded={openAddMenu ? 'true' : undefined}
                  aria-haspopup="true"
                  aria-label="Add new…"
                  className={classes.button}
                  color="inherit"
                  edge="start"
                  id="openAddMenuButton"
                  onClick={e => setAddMenuAnchor(e.currentTarget)}
                  size="large"
                  sx={{ marginRight: 1 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                className={classes.button}
                onClick={e => setProfileMenuAnchor(e.currentTarget)}
                color="inherit"
                size="small"
                startIcon={
                  <Avatar
                    sx={{ height: 30, width: 30 }}
                    alt={`${account.fname}
                    ${account.lname}`}
                  />
                }
              >
                {' '}
                {account.fname} {account.lname.charAt(0)}.{' '}
                <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <main className={classes.main}>
        <Container>
          <Toolbar disableGutters sx={{ marginBottom: 5 }}>
            <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
              Your Channels
            </Typography>
            <Typography variant="overline">
              Sort channels:
              <Link sx={{ marginLeft: 0.5 }} onClick={e => setSortMenuAnchor(e.currentTarget)}>
                By title A->Z
                <ArrowDropDownIcon fontSize="small" sx={{ marginLeft: 0.5, verticalAlign: 'middle' }} />
              </Link>
            </Typography>
          </Toolbar>
          {channels.map(channel => {
            return (
              <>
                <Typography gutterBottom variant="h5">
                  {channel.title}
                </Typography>
                <TableContainer sx={{ marginBottom: 10 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">Media</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Visibility</TableCell>
                        <TableCell padding="checkbox"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {channel.media.map(media => {
                        return (
                          <TableRow key={media.id}>
                            <TableCell padding="checkbox">
                              <img src={media.thumb} width={40} />
                            </TableCell>
                            <TableCell>{media.title}</TableCell>
                            <TableCell>{media.status}</TableCell>
                            <TableCell>{media.visibility}</TableCell>
                            <TableCell padding="checkbox">
                              <IconButton size="small">
                                <MoreHorizIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            );
          })}
        </Container>
      </main>
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
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <TuneIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>Organization settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <LibraryAddIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>Change organization…</ListItemText>
        </MenuItem>
      </Menu>
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
            <SettingsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>Preferences</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <LogoutIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>Log out</ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={sortMenuAnchor}
        id="sortMenu"
        MenuListProps={{
          'aria-labelledby': 'openSortMenuButton',
          dense: true,
        }}
        onClose={() => setSortMenuAnchor(null)}
        open={openSortMenu}
        variant="menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>By title A->Z</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemText primaryTypographyProps={{ color: 'primary' }}>By title Z->A</ListItemText>
        </MenuItem>
      </Menu>
    </Root>
  );
}
