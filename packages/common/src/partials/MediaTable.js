import React, { useState } from 'react';
import _ from 'lodash';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
import TranslateIcon from '@mui/icons-material/Translate';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import { getComparator, stableSort } from '../utils';

const PREFIX = `MediaTable`;
const classes = {
  thumbCell: `${PREFIX}-thumbCell`,
};

const Root = styled(
  'div',
  {},
)(({ theme }) => ({
  [`& .${classes.thumbCell}`]: {
    width: '0',
  },
  [`& .MuiCard-root`]: {
    display: 'inline-block',
  },
}));

function Status(props) {
  const { status, description, isPublic } = props;
  if (status === 'uploading') {
    return (
      <Tooltip title="Uploading… Keep the tab browser open for now…">
        <CircularProgress color="error" size={16} />
      </Tooltip>
    );
  } else if (['uploaded', 'transcribing'].includes(status)) {
    return (
      <Tooltip title="Processing your media. Please check back later.">
        <CircularProgress color="primary" size={16} />
      </Tooltip>
    );
  } else if (status === 'transcribed') {
    return (
      <Tooltip title="Ready to edit">
        {/* <SpellcheckIcon fontSize="small" color="primary" /> */}
        <CheckCircleIcon fontSize="small" color="primary" />
      </Tooltip>
    );
  }
  //  else if (status === 'edited') {
  //   return (
  //     <Tooltip title="Edited">
  //       <DoneAllIcon fontSize="small" color="primary" />
  //     </Tooltip>
  //   );
  // }
  else if (status === 'corrected') {
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
  else if (status === 'error') {
    return (
      <Tooltip title={`Processing failed. Try adding this media again.${description ? ` [${description}]` : ''}`}>
        <ErrorIcon fontSize="small" color="error" />
      </Tooltip>
    );
  }
  return null;
}

export function MediaTable(props) {
  const { channels, organization, account, media, onDeleteMedia, onEditMedia, onTranslateMedia } = props;

  const flatMedia = media.map(o => {
    return { ...o, channelId: o.channel?.id };
  });

  const [focused, setFocused] = useState();
  const [itemMoreMenuAnchor, setItemMoreMenuAnchor] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('created');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selected, setSelected] = useState([]);

  const openItemMoreMenu = Boolean(itemMoreMenuAnchor);

  const handleSelectClick = id => () => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = media.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeSort = property => event => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEdit = ids => {
    onEditMedia(ids);
    setItemMoreMenuAnchor(null);
    setFocused(null);
    setSelected([]);
  };

  const handleTranslate = ids => {
    onTranslateMedia(ids);
    setItemMoreMenuAnchor(null);
    setFocused(null);
    setSelected([]);
  };

  const handleDelete = ids => {
    onDeleteMedia(ids);
    setItemMoreMenuAnchor(null);
    setFocused(null);
    setSelected([]);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - media.length) : 0;

  const headCells = [
    {
      id: 'title',
      label: 'Media',
      span: 2,
    },
    // { id: "silentName", skip: true },
    {
      hide: true,
      id: 'createdAt',
      label: 'Created',
    },
    {
      hide: true,
      id: 'updatedAt',
      label: 'Updated',
    },
    {
      hide: true,
      id: 'channelId',
      label: 'Channel',
    },
    {
      id: 'status',
      label: 'Status',
    },
  ];

  return (
    <Root>
      <Toolbar disableGutters>
        {selected.length > 0 ? (
          <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
            <Typography color="inherit" component="div" display="inline-block" sx={{ mr: 2 }} variant="h3">
              {selected.length} selected:
            </Typography>
            <Button color="error" onClick={() => handleDelete(selected)} size="small" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Box>
        ) : (
          <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
            <Typography component="div" id="tableTitle" variant="h3">
              All media
            </Typography>
          </Box>
        )}
        <TablePagination
          className={classes.pagination}
          component="div"
          count={media?.length || 0}
          labelRowsPerPage="Rows:"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Toolbar>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < media.length}
                  checked={media?.length > 0 && selected.length === media.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
              {headCells.map(headCell => (
                <TableCell
                  colSpan={headCell.span || 1}
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    display: {
                      xs: headCell.hide ? 'none' : 'table-cell',
                      lg: 'table-cell',
                    },
                  }}
                >
                  {!headCell.silent && (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={handleChangeSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
            {stableSort(flatMedia, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = selected.indexOf(row.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                console.log({ row });

                const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' };
                const cDate = new Date(row.createdAt);
                const cFormattedDate = new Intl.DateTimeFormat('en', dateFormat).format(cDate);
                const uDate = new Date(row.updatedAt);
                const uFormattedDate = new Intl.DateTimeFormat('en', dateFormat).format(uDate);

                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => console.log('open')}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        onClick={handleSelectClick(row.id)}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell id={labelId} className={classes.thumbCell} sx={{ lineHeight: 0 }}>
                      <Card
                        sx={{
                          width: { xs: 82, lg: 82 },
                          height: { xs: 47, lg: 47 },
                        }}
                      >
                        <CardActionArea
                          onClick={e => {
                            e.stopPropagation();
                            console.log('hello');
                          }}
                        >
                          <CardMedia component="img" height="100%" image={row.poster} />
                        </CardActionArea>
                      </Card>
                    </TableCell>
                    <TableCell component="th" id={labelId} padding="none" scope="row">
                      <Link
                        disabled={row.isProcessing}
                        underline={row.isProcessing ? 'none' : 'hover'}
                        display="block"
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 500,
                          maxWidth: {
                            xs: '180px',
                            sm: '320px',
                            md: '460px',
                            lg: '400px',
                          },
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          console.log('hello');
                        }}
                        noWrap
                        color={row.isProcessing ? 'text.disabled' : 'primary'}
                        variant="body2"
                      >
                        {row.title}
                      </Link>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', lg: 'table-cell' },
                      }}
                    >
                      <Typography color="textSecondary" display="block" noWrap variant="caption">
                        {row.createdAt ? cFormattedDate : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', lg: 'table-cell' },
                      }}
                    >
                      <Typography color="textSecondary" display="block" noWrap variant="caption">
                        {row.updatedAt ? uFormattedDate : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', lg: 'table-cell' },
                      }}
                    >
                      <Typography color="textSecondary" display="block" noWrap variant="caption">
                        {row.channel?.name ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Status
                        status={row.status?.label}
                        description={row.status?.description}
                        isPublic={!row.private}
                      />
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        disabled={row.isProcessing}
                        fontSize="small"
                        onClick={e => {
                          e.stopPropagation();
                          setFocused(row.id);
                          setItemMoreMenuAnchor(e.currentTarget);
                          setSelected([row.id]);
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
      {Boolean(focused) && (
        <Menu
          anchorEl={itemMoreMenuAnchor}
          id="itemMoreMenu"
          MenuListProps={{
            'aria-labelledby': 'openItemMoreButton',
            dense: true,
          }}
          onClose={() => setItemMoreMenuAnchor(null)}
          open={openItemMoreMenu}
          variant="menu"
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              handleEdit([focused]);
              setItemMoreMenuAnchor(null);
              setFocused(null);
              setSelected([]);
            }}
          >
            <ListItemIcon>
              <EditIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'primary' }}>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleTranslate([focused]);
              setItemMoreMenuAnchor(null);
              setFocused(null);
              setSelected([]);
            }}
          >
            <ListItemIcon>
              <TranslateIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'primary' }}>Translate</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleDelete([focused]);
            }}
          >
            <ListItemIcon>
              <DeleteIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Root>
  );
}
