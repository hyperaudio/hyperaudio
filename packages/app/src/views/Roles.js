import React, { useReducer, useState, useCallback } from "react";
import _ from "lodash";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import { Main, Topbar } from "@hyperaudio/app/src/components";
import { RecursiveMenuItem } from "@hyperaudio/common";
import { getComparator, stableSort } from "@hyperaudio/app/src/utils";
import { teamReducer } from "@hyperaudio/app/src/reducers";

const PREFIX = `Roles`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled("div", {})(({ theme }) => ({}));

export function Roles(props) {
  const { organization, team, account } = props;

  const [{ members }, dispatch] = useReducer(teamReducer, {
    members: props.team.members,
  });

  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = useState(null);

  const [inspected, setInspected] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("created");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selected, setSelected] = useState([]);

  const openItemMoreMenu = Boolean(itemMoreMenuAnchor);

  const deleteMembers = useCallback(
    (ids) => dispatch({ type: "deleteMembers", payload: ids }),
    [team]
  );
  const editRole = useCallback(
    (payload) => dispatch({ type: "changeMemberRole", payload }),
    [team]
  );

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
      const newSelecteds = members.map((n) => n.userId);
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

  const handleRemove = (ids) => {
    deleteMembers(ids);
    setSelected([]);
  };

  const handleRoleChange = ({ id, role, value }) => {
    editRole({ id, role, value });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

  const headCells = [
    {
      id: "displayName",
      label: "User",
    },
    {
      hide: true,
      id: "isOrganiser",
      label: "Organiser",
    },
    {
      hide: true,
      id: "isEditor",
      label: "Editor",
    },
    {
      hide: true,
      id: "isRemixer",
      label: "Remixer",
    },
    {
      hide: true,
      id: "isViewer",
      label: "Viewer",
    },
    {
      hide: true,
      id: "isSpeaker",
      label: "Speaker",
    },
    {
      hide: true,
      id: "pointer",
      label: "Payment pointer",
    },
  ];

  const flatMembers = members.map(
    ({ displayName, userId, userStatus, email, payment, roles }) => ({
      displayName,
      email,
      isEditor: roles.editor,
      isOrganiser: roles.organiser,
      isRemixer: roles.remixer,
      isSpeaker: roles.speaker,
      isViewer: roles.viewer,
      pointer: payment.pointer || "—",
      userId,
      userStatus,
    })
  );

  return (
    <>
      <Root className={classes.root}>
        <Topbar account={account} organization={organization} />
        <Main>
          <Toolbar disableGutters>
            {selected.length > 0 ? (
              <Box sx={{ flex: "1 1 auto", display: "flex" }}>
                <Typography
                  color="inherit"
                  variant="h6"
                  component="div"
                  display="inline-block"
                  sx={{ mr: 1 }}
                >
                  {selected.length} selected:
                </Typography>
                <Tooltip title="Remove from team">
                  <IconButton
                    onClick={() => handleRemove(selected)}
                    size="small"
                  >
                    <PersonRemoveIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Typography
                sx={{ flex: "1 1 auto" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Team members
              </Typography>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={members.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Toolbar>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size="medium"
              sx={{ width: "100%" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < members.length
                      }
                      checked={
                        members.length > 0 && selected.length === members.length
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
                      sx={{
                        display: {
                          xs: headCell.hide ? "none" : "table-cell",
                          lg: "table-cell",
                        },
                      }}
                    >
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
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(flatMembers, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((o, index) => {
                    const isItemSelected = selected.indexOf(o.userId) !== -1;
                    const isUserPending = o.userStatus === 0;
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={o.userId}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            onClick={(event) =>
                              handleSelectClick(event, o.userId)
                            }
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <Typography
                            display="block"
                            noWrap
                            variant="subtitle2"
                          >
                            {o.displayName}
                          </Typography>
                          <Typography display="block" noWrap variant="caption">
                            {o.email}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Checkbox
                            checked={o.isOrganiser}
                            checkedIcon={<CheckCircleIcon />}
                            disabled
                            icon={<RadioButtonUncheckedIcon />}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Checkbox
                            checked={o.isEditor}
                            checkedIcon={<CheckCircleIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            onChange={(e) =>
                              handleRoleChange({
                                id: o.userId,
                                role: "editor",
                                value: e.target.checked,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Checkbox
                            checked={o.isRemixer}
                            checkedIcon={<CheckCircleIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            onChange={(e) =>
                              handleRoleChange({
                                id: o.userId,
                                role: "remixer",
                                value: e.target.checked,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Checkbox
                            checked={o.isViewer}
                            checkedIcon={<CheckCircleIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            onChange={(e) =>
                              handleRoleChange({
                                id: o.userId,
                                role: "viewer",
                                value: e.target.checked,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Checkbox
                            checked={o.isSpeaker}
                            checkedIcon={<CheckCircleIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            onChange={(e) =>
                              handleRoleChange({
                                id: o.userId,
                                role: "speaker",
                                value: e.target.checked,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            display: { xs: "none", lg: "table-cell" },
                          }}
                        >
                          <Typography variant="caption">{o.pointer}</Typography>
                        </TableCell>
                        <TableCell padding="checkbox">
                          <IconButton
                            disabled={o.isProcessing}
                            fontSize="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspected(o.userId);
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
        </Main>
      </Root>
      <Popper
        anchorEl={itemMoreMenuAnchor}
        onClick={() => setItemMoreMenuAnchor(null)}
        onClose={() => setItemMoreMenuAnchor(null)}
        open={Boolean(itemMoreMenuAnchor)}
        placement="bottom-end"
      >
        <Grow in={open} appear={open}>
          <Paper elevation={12}>
            <ClickAwayListener onClickAway={() => setItemMoreMenuAnchor(null)}>
              <MenuList dense={true}>
                <RecursiveMenuItem
                  autoFocus={false}
                  label={
                    <>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon
                          fontSize="small"
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Change roles"
                        primaryTypographyProps={{ color: "primary" }}
                      />
                      <ArrowRightIcon fontSize="small" />
                    </>
                  }
                  placement="left-start"
                  elevation={0}
                  MenuListProps={{ dense: true }}
                >
                  <MenuItem onClick={() => console.log("Text")}>
                    <ListItemText
                      primary="Text"
                      primaryTypographyProps={{ color: "primary" }}
                    />
                  </MenuItem>
                  <MenuItem onClick={() => console.log("JSON")}>
                    <ListItemText
                      primary="JSON"
                      primaryTypographyProps={{ color: "primary" }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={() => console.log("WP Plugin-compatible HTML")}
                  >
                    <ListItemText
                      primary="WP Plugin-compatible HTML"
                      primaryTypographyProps={{ color: "primary" }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={() => console.log("Interactive transcript")}
                  >
                    <ListItemText
                      primary="Interactive Transcript"
                      primaryTypographyProps={{ color: "primary" }}
                    />
                  </MenuItem>
                </RecursiveMenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleRemove([inspected]);
                    setItemMoreMenuAnchor(null);
                    setInspected(null);
                  }}
                >
                  <ListItemIcon>
                    <PersonRemoveIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ color: "error" }}>
                    Remove from team
                  </ListItemText>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      </Popper>
      {/* <Menu
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
        <MenuItem
          onClick={() => {
            handleRemove([inspected]);
            setItemMoreMenuAnchor(null);
            setInspected(null);
          }}
        >
          <ListItemIcon>
            <AdminPanelSettingsIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Change role
          </ListItemText>
        </MenuItem>
      </Menu> */}
    </>
  );
}
