import React from "react";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import HomeIcon from "@mui/icons-material/Home";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import IconButton from "@mui/material/IconButton";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import TranslateIcon from "@mui/icons-material/Translate";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import { styled } from "@mui/material/styles";

const PREFIX = `Dashboard`;
const classes = {
  button: `${PREFIX}-button`,
  flicker: `${PREFIX}-flicker`,
  tableContainer: `${PREFIX}-tableContainer`,
  leftCol: `${PREFIX}-leftCol`,
  main: `${PREFIX}-main`,
  topbar: `${PREFIX}-topbar`,
};

const Root = styled(
  "div",
  {}
)(({ theme }) => ({
  [`& .${classes.button}`]: {
    // background: theme.palette.background.default,
  },
  [`& .${classes.main}`]: {
    padding: theme.spacing(8, 0),
  },
  [`& .${classes.topbar}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    [`& .MuiButton-root:hover, & .MuiIconButton-root:hover`]: {
      backgroundColor: theme.palette.primary.light,
    },
    [`& .MuiAvatar-root`]: {
      backgroundColor: theme.palette.secondary.main,
      fontSize: "1em",
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 1,
    },
  },
  [`& .${classes.leftCol}`]: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: 0,
  },
  [`& .${classes.tableContainer}`]: {
    // background: theme.palette.background.paper,
    // borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(10),
    // maxHeight: '600px',
    // overflow: 'auto',
    // padding: theme.spacing(1, 3),
  },
  [`& .${classes.flicker}`]: {
    animation: `flickerAnimation 1.66s infinite`,
  },
  "@keyframes flickerAnimation": {
    "0%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.5,
    },
    "100%": {
      opacity: 1,
    },
  },
}));

function Status(props) {
  const { status, isPublic } = props;
  if (status === "uploading") {
    return (
      <Tooltip title="Uploading…">
        <CloudUploadIcon
          fontSize="small"
          color="primary"
          className={classes.flicker}
        />
      </Tooltip>
    );
  } else if (status === "uploaded") {
    return (
      <Tooltip title="Uploaded">
        <CloudDoneIcon fontSize="small" color="disabled" />
      </Tooltip>
    );
  } else if (status === "transcribing") {
    return (
      <Tooltip title="Processing…">
        <HourglassTopIcon
          fontSize="small"
          color="primary"
          className={classes.flicker}
        />
      </Tooltip>
    );
  }
  //  else if (status === 'transcribed') {
  //   return (
  //     <Tooltip title="Ready to edit">
  //       <SpellcheckIcon fontSize="small" color="primary" />
  //     </Tooltip>
  //   );
  // }
  //  else if (status === 'edited') {
  //   return (
  //     <Tooltip title="Edited">
  //       <DoneAllIcon fontSize="small" color="primary" />
  //     </Tooltip>
  //   );
  // }
  else if (status === "corrected") {
    return (
      <Tooltip title="Media marked as corrected">
        <CheckCircleIcon fontSize="small" color="disabled" />
      </Tooltip>
    );
  }
  // else if (status === "ready") {
  //   return (
  //     <Tooltip
  //       title={
  //         isPublic
  //           ? "Media is publically available"
  //           : "Media is being kept private"
  //       }
  //     >
  //       {isPublic ? (
  //         <PublicIcon fontSize="small" color="disabled" />
  //       ) : (
  //         <PublicOffIcon fontSize="small" color="disabled" />
  //       )}
  //     </Tooltip>
  //   );
  // }
  else if (status === "error") {
    return (
      <Tooltip title="Processing failed. Try again.">
        <ErrorIcon fontSize="small" color="error" />
      </Tooltip>
    );
  }
  return null;
}

export function Dashboard(props) {
  const { channels, organization, account } = props;

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const openAddMenu = Boolean(addMenuAnchor);
  const openItemMoreMenu = Boolean(itemMoreMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openProfileMenu = Boolean(profileMenuAnchor);

  return (
    <Root>
      <AppBar position="fixed" elevation={0} className={classes.topbar}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Button
                className={classes.button}
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
                <Hidden mdDown sx={{ marginRight: 0.5 }}>
                  {organization.name}
                </Hidden>
                <ArrowDropDownIcon fontSize="small" />
              </Button>
              <Tooltip title="Open your organization’s home page">
                <IconButton
                  className={classes.button}
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
              <Typography variant="subtitle1">Your Channels</Typography>
            </Grid>
            <Grid item xs={4} align="right">
              <Tooltip title="Add new…">
                <IconButton
                  aria-expanded={openAddMenu ? "true" : undefined}
                  aria-haspopup="true"
                  aria-label="Add new…"
                  className={classes.button}
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
                className={classes.button}
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
                <Hidden mdDown sx={{ marginRight: 0.5 }}>
                  {account.fname} {account.lname.charAt(0)}.
                </Hidden>{" "}
                <ArrowDropDownIcon fontSize="small" />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <main className={classes.main}>
        <Container>
          {channels.map((channel) => {
            return (
              <div key={channel.channelId}>
                <Typography gutterBottom variant="h5" color="primary.dark">
                  {channel.title}
                </Typography>
                <TableContainer className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.leftCol}>Media</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Last modified</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell
                          align="center"
                          padding="checkbox"
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {channel.media.map((media) => {
                        const isProcessing = [
                          "uploading",
                          "uploaded",
                          "transcribing",
                        ].includes(media.status);
                        return (
                          <TableRow key={media.mediaId}>
                            <TableCell className={classes.leftCol}>
                              <Card sx={{ width: 80, height: 60 }}>
                                <CardActionArea
                                  onClick={() => console.log("hello")}
                                >
                                  <CardMedia
                                    component="img"
                                    height="100%"
                                    image={media.thumb}
                                  />
                                </CardActionArea>
                              </Card>

                              {/* <Thumb img={media.thumb} height={48} width={60} /> */}
                            </TableCell>
                            <TableCell>
                              <Link
                                disabled={isProcessing}
                                underline={isProcessing ? "none" : "hover"}
                                sx={{ cursor: "pointer" }}
                                onClick={() => console.log("hello")}
                                noWrap
                                color={
                                  isProcessing ? "text.disabled" : "primary"
                                }
                                variant="subtitle2"
                              >
                                {media.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={media.created || "Not available"}>
                                <Typography
                                  sx={{
                                    color: isProcessing
                                      ? "text.disabled"
                                      : "text.secondary",
                                  }}
                                  variant="caption"
                                >
                                  {media.created}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={media.modified || "Not available"}
                              >
                                <Typography
                                  sx={{
                                    color: isProcessing
                                      ? "text.disabled"
                                      : "text.secondary",
                                  }}
                                  variant="caption"
                                >
                                  {media?.modified || "—"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              {media.isPublic && (
                                <PublicIcon fontSize="small" color="disabled" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Status
                                status={media.status}
                                isPublic={media.isPublic}
                              />
                            </TableCell>
                            <TableCell align="center" padding="checkbox">
                              <IconButton
                                disabled={isProcessing}
                                edge="end"
                                fontSize="small"
                                onClick={(e) =>
                                  setItemMoreMenuAnchor(e.currentTarget)
                                }
                              >
                                <MoreHorizIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            );
          })}
        </Container>
      </main>
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
        <MenuItem onClick={() => setAddMenuAnchor(null)}>
          <ListItemIcon>
            <SettingsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Organization settings
          </ListItemText>
        </MenuItem>
      </Menu>
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
        anchorEl={itemMoreMenuAnchor}
        id="itemMoreMenu"
        MenuListProps={{
          "aria-labelledby": "openItemMoreButton",
          dense: true,
        }}
        onClose={() => setItemMoreMenuAnchor(null)}
        open={openItemMoreMenu}
        variant="menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <EditIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Edit
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <ListItemIcon>
            <TranslateIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Translate
          </ListItemText>
        </MenuItem>
      </Menu>
    </Root>
  );
}
