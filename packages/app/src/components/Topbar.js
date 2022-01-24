import React from "react";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import { styled } from "@mui/material/styles";

const PREFIX = `Topbar`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled(AppBar)(({ theme }) => ({
  [`& .MuiButton-root:hover, & .MuiIconButton-root:hover`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .MuiAvatar-root`]: {
    background: theme.palette.secondary.main,
    fontSize: "1em !important",
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 1,
  },
}));

export function Topbar(props) {
  const { account, organization } = props;

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const openAddMenu = Boolean(addMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openProfileMenu = Boolean(profileMenuAnchor);

  return (
    <>
      <Root position="fixed" elevation={0} className={classes.root}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Button
                onClick={(e) => setOrgMenuAnchor(e.currentTarget)}
                size="small"
                color="inherit"
                startIcon={
                  <Avatar
                    sx={{ height: 28, width: 28 }}
                    alt={`${account.fname}
                    ${account.lname}`}
                  >
                    {organization.name.charAt(0)}
                  </Avatar>
                }
              >
                {" "}
                <Hidden mdDown>{organization.name}</Hidden>
                <ArrowDropDownIcon fontSize="small" />
              </Button>
              <Tooltip title="Open your organization’s home page">
                <IconButton
                  color="inherit"
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
              <Typography variant="subtitle1">Your Media</Typography>
            </Grid>
            <Grid item xs={4} align="right">
              <Tooltip title="Add new…">
                <IconButton
                  aria-expanded={openAddMenu ? "true" : undefined}
                  aria-haspopup="true"
                  aria-label="Add new…"
                  color="inherit"
                  edge="start"
                  id="openAddMenuButton"
                  onClick={(e) => setAddMenuAnchor(e.currentTarget)}
                  sx={{ marginRight: 1 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
                color="inherit"
                size="small"
                startIcon={
                  <Avatar
                    sx={{ height: 30, width: 30 }}
                    alt={`${account.fname}
                    ${account.lname}`}
                  >
                    {account.fname.charAt(0)} {account.lname.charAt(0)}
                  </Avatar>
                }
              >
                {" "}
                <Hidden mdDown>
                  {account.fname} {account.lname.charAt(0)}.
                </Hidden>{" "}
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
          "aria-labelledby": "openAddMenuButton",
          dense: true,
        }}
        onClose={() => setAddMenuAnchor(null)}
        open={openAddMenu}
        variant="menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <VideocamIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            New media…
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <LibraryAddIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            New channel…
          </ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={profileMenuAnchor}
        id="profileMenu"
        MenuListProps={{
          "aria-labelledby": "openProfileMenuButton",
          dense: true,
        }}
        onClose={() => setProfileMenuAnchor(null)}
        open={openProfileMenu}
        variant="menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <TuneIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Preferences
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <LogoutIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "error" }}>
            Log out
          </ListItemText>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={orgMenuAnchor}
        id="orgMenu"
        MenuListProps={{
          "aria-labelledby": "openOrgMenuButton",
          dense: true,
        }}
        onClose={() => setOrgMenuAnchor(null)}
        open={openOrgMenu}
        variant="menu"
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setOrgMenuAnchor(null)}>
          <ListItemIcon>
            <SettingsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Organization settings
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
