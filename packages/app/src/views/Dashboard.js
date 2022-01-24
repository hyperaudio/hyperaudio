import * as React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
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
import SettingsIcon from "@mui/icons-material/Settings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import TranslateIcon from "@mui/icons-material/Translate";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

const PREFIX = `Dashboard`;
const classes = {
  flicker: `${PREFIX}-flicker`,
  leftCol: `${PREFIX}-leftCol`,
  main: `${PREFIX}-main`,
  thumbCell: `${PREFIX}-thumbCell`,
  topbar: `${PREFIX}-topbar`,
};

const Root = styled(
  "div",
  {}
)(({ theme }) => ({
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
  [`& .${classes.thumbCell}`]: {
    width: "0",
  },
  [`& .MuiCard-root`]: {
    display: "inline-block",
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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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
  } else if (["uploaded", "transcribing"].includes(status)) {
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

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Your media
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export function Dashboard(props) {
  const { channels, media, organization, account } = props;

  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);
  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = React.useState(null);
  const [orgMenuAnchor, setOrgMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("created");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [selected, setSelected] = React.useState([]);

  const openAddMenu = Boolean(addMenuAnchor);
  const openItemMoreMenu = Boolean(itemMoreMenuAnchor);
  const openOrgMenu = Boolean(orgMenuAnchor);
  const openProfileMenu = Boolean(profileMenuAnchor);

  const handleSelectClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = media.map((n) => n.mediaId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeSort = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - media.length) : 0;

  const headCells = [
    {
      id: "name",
      label: "Media",
      span: 2,
    },
    // { id: "silentName", skip: true },
    {
      id: "created",
      label: "Created",
    },
    {
      id: "modified",
      label: "Modified",
    },
    {
      id: "channelId",
      label: "Channel",
    },
    {
      id: "status",
      label: "Status",
    },
  ];

  console.log({ order, orderBy });

  return (
    <Root>
      <AppBar position="fixed" elevation={0} className={classes.topbar}>
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
      </AppBar>
      <Toolbar />
      <main className={classes.main}>
        <Container maxWidth="none">
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              sx={{ minWidth: 750 }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < media.length
                      }
                      checked={
                        media.length > 0 && selected.length === media.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                  {headCells.map((headCell) => (
                    <TableCell
                      colSpan={headCell.span || 1}
                      key={headCell.id}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      {!headCell.silent && (
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={handleChangeSort(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(media, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = selected.indexOf(row.mediaId) !== -1;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.mediaId}
                        onClick={() => console.log("open")}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            onClick={(event) =>
                              handleSelectClick(event, row.mediaId)
                            }
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell id={labelId} className={classes.thumbCell}>
                          <Card sx={{ width: 60, height: 45 }}>
                            <CardActionArea
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("hello");
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="100%"
                                image={row.thumb}
                              />
                            </CardActionArea>
                          </Card>
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <Link
                            disabled={row.isProcessing}
                            underline={row.isProcessing ? "none" : "hover"}
                            sx={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("hello");
                            }}
                            noWrap
                            color={
                              row.isProcessing ? "text.disabled" : "primary"
                            }
                            variant="subtitle2"
                          >
                            {row.name}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {row.created || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {row.modified || "—"}
                        </TableCell>
                        <TableCell>
                          {_.find(
                            channels,
                            (o) => o.channelId === row.channelId
                          )?.name || "—"}
                        </TableCell>
                        <TableCell>
                          <Status status={row.status} />
                        </TableCell>
                        <TableCell padding="checkbox">
                          <IconButton
                            disabled={row.isProcessing}
                            fontSize="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemMoreMenuAnchor(e.currentTarget);
                            }}
                          >
                            <MoreHorizIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 83 * emptyRows,
                      // height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={media.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
