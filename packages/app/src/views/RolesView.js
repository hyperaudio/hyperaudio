import React, { useReducer, useState, useCallback } from "react";
import _ from "lodash";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
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
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import { InviteTeamMemberDialog } from "@hyperaudio/app/src/dialogs";
import { Main, Topbar } from "@hyperaudio/app/src/components";
import { getComparator, stableSort } from "@hyperaudio/app/src/utils";
import { teamReducer } from "@hyperaudio/app/src/reducers";

const PREFIX = `RolesView`;
const classes = {
  root: `${PREFIX}-Root`,
  pagination: `${PREFIX}-Pagination`,
};

const Root = styled(
  "div",
  {}
)(({ theme }) => ({
  [`& .${classes.pagination}`]: {
    [`& .MuiTablePagination-spacer, & .MuiTablePagination-selectLabel`]: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
  },
}));

export function RolesView(props) {
  const { organization, team, account } = props;

  const [{ members }, dispatch] = useReducer(teamReducer, {
    members: props.team.members,
  });

  const [adding, setAdding] = useState(false);
  const [focused, setFocused] = useState();
  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = useState(null);
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

  const handleMemberAdd = useCallback(
    (email) => dispatch({ type: "addMember", payload: email }),
    [team]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

  const headCells = [
    {
      id: "displayName",
      label: "Member",
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

  const getRoles = (id) => {
    const keys = ["Organiser", "Editor", "Remixer", "Viewer", "Speaker"];
    return keys.map((key) => ({
      key: `is${key}`,
      label: key,
      value: _.find(flatMembers, (o) => o.userId === id)[`is${key}`],
    }));
  };

  return (
    <>
      <Root className={classes.root}>
        <Topbar
          account={account}
          organization={organization}
          title="Your Team"
        />
        <Main>
          <Toolbar disableGutters>
            {selected.length > 0 ? (
              <Box
                sx={{ flex: "1 1 auto", display: "flex", alignItems: "center" }}
              >
                <Typography
                  color="inherit"
                  component="div"
                  display="inline-block"
                  sx={{ mr: 2 }}
                  variant="h6"
                >
                  {selected.length} selected:
                </Typography>
                <Button
                  color="error"
                  onClick={() => handleRemove(selected)}
                  size="small"
                  startIcon={<PersonRemoveIcon />}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box
                sx={{ flex: "1 1 auto", display: "flex", alignItems: "center" }}
              >
                <Typography
                  component="div"
                  id="tableTitle"
                  sx={{ mr: 2 }}
                  variant="h6"
                >
                  Team members
                </Typography>
                <Button
                  color="primary"
                  onClick={() => setAdding(true)}
                  size="small"
                  startIcon={<PersonAddIcon />}
                >
                  Add new
                </Button>
              </Box>
            )}
            <TablePagination
              className={classes.pagination}
              component="div"
              count={members.length}
              labelRowsPerPage="Rows:"
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
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
                    const isItemFocused = focused === o.userId || false;
                    const isItemSelected = selected.indexOf(o.userId) !== -1;
                    const isUserPending = o.userStatus === 0;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    const allRoles = getRoles(o.userId);

                    return (
                      <TableRow
                        hover
                        key={o.userId}
                        selected={isItemSelected}
                        tabIndex={-1}
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

                        {allRoles.map((role) => {
                          return (
                            <TableCell
                              key={role.key}
                              sx={{
                                display: { xs: "none", lg: "table-cell" },
                              }}
                              padding="checkbox"
                            >
                              <Checkbox
                                checked={role.value}
                                checkedIcon={<CheckCircleIcon />}
                                disabled={role.key === "isOrganiser"}
                                icon={<RadioButtonUncheckedIcon />}
                                onChange={(e) =>
                                  handleRoleChange({
                                    id: o.userId,
                                    role: role.label.toLowerCase(),
                                    value: e.target.checked,
                                  })
                                }
                              />
                            </TableCell>
                          );
                        })}

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
                              setFocused(o.userId);
                              setItemMoreMenuAnchor(e.currentTarget);
                              setSelected([o.userId]);
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
      {Boolean(focused) && (
        <Menu
          anchorEl={itemMoreMenuAnchor}
          id="itemMoreMenu"
          MenuListProps={{
            "aria-labelledby": "openItemMoreButton",
            dense: true,
            subheader: (
              <ListSubheader component="div" id="nested-list-subheader">
                Edit user roles:
              </ListSubheader>
            ),
          }}
          onClose={() => {
            setFocused();
            setItemMoreMenuAnchor();
            setSelected([]);
          }}
          open={openItemMoreMenu}
          variant="menu"
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {getRoles(focused).map((role) => {
            if (role.key === "isOrganiser") return null;
            return (
              <MenuItem
                key={role.key}
                onClick={(e) => {
                  handleRoleChange({
                    id: focused,
                    role: role.label.toLowerCase(),
                    value: !role.value,
                  });
                  e.stopPropagation();
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={role.value}
                    checkedIcon={<CheckCircleIcon />}
                    edge="start"
                    icon={<RadioButtonUncheckedIcon />}
                    inputProps={{ "aria-labelledby": `label-${role.key}` }}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  id={role.key}
                  primary={role.label}
                  primaryTypographyProps={{ color: "primary" }}
                />
              </MenuItem>
            );
          })}
          <Divider />
          <MenuItem
            onClick={() => {
              handleRemove([focused]);
              setItemMoreMenuAnchor(null);
              setFocused(null);
            }}
          >
            <ListItemIcon>
              <PersonRemoveIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: "error" }}>
              Remove from team
            </ListItemText>
          </MenuItem>
        </Menu>
      )}
      {adding && (
        <InviteTeamMemberDialog
          onClose={() => setAdding(false)}
          onSubmit={handleMemberAdd}
        />
      )}
    </>
  );
}
