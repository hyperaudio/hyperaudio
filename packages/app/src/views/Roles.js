import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import { Main, Topbar } from "@hyperaudio/app/src/components";
import { getComparator, stableSort } from "@hyperaudio/app/src/utils";

const PREFIX = `Roles`;
const classes = {
  root: `${PREFIX}-Root`,
};

const Root = styled("div", {})(({ theme }) => ({}));

export function Roles(props) {
  const { organization, account } = props;
  const { members } = organization;

  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = React.useState(null);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("created");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [selected, setSelected] = React.useState([]);

  const openItemMoreMenu = Boolean(itemMoreMenuAnchor);

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

  const headCells = [
    {
      id: "user",
      label: "User",
    },
    { id: "organiser", label: "Organiser" },
    {
      hide: true,
      id: "editor",
      label: "Editor",
    },
    {
      hide: true,
      id: "remixer",
      label: "Remixer",
    },
    {
      hide: true,
      id: "viewer",
      label: "Viewer",
    },
    {
      hide: true,
      id: "speaker",
      label: "Speaker",
    },
    {
      hide: true,
      id: "pointer",
      label: "Payment pointer",
    },
  ];

  return (
    <Root className={classes.root}>
      <Topbar account={account} organization={organization} />
      <Main>
        <Toolbar disableGutters>
          {selected.length > 0 ? (
            <Box sx={{ flex: "1 1 100%", display: "flex" }}>
              <Typography
                color="inherit"
                variant="h6"
                component="div"
                display="inline-block"
                sx={{ mr: 1 }}
              >
                {selected.length} selected:
              </Typography>
              <Tooltip title="Delete">
                <IconButton size="">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography
              sx={{ flex: "1 1 100%" }}
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
              {stableSort(members, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = selected.indexOf(row.userId) !== -1;
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.userId}
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
                            handleSelectClick(event, row.userId)
                          }
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link display="block" noWrap variant="subtitle2">
                          {row.displayName}
                        </Link>
                        <Typography display="block" noWrap variant="caption">
                          {row.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={row.roles.organiser} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={row.roles.editor} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={row.roles.remixer} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={row.roles.speaker} />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={row.roles.viewer} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {row.payment.pointer}
                        </Typography>
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
      </Main>
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
        <MenuItem onClick={() => setItemMoreMenuAnchor(null)}>
          <ListItemIcon>
            <EditIcon color="primary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "primary" }}>
            Edit
          </ListItemText>
        </MenuItem>
      </Menu>
    </Root>
  );
}
