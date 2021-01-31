import NextLink from 'next/link';
import React from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Layout from 'src/Layout';

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export default function Channels() {
  const classes = useStyles();

  const channels = [
    {
      description: 'A description',
      editors: ['190d5865-d881-443d-863b-b1a00ee9ddf2'],
      id: 0,
      tags: ['a tag', 'another tag'],
      title: 'Channel title',
    },
    {
      description: 'A description',
      editors: ['190d5865-d881-443d-863b-b1a00ee9ddf2'],
      id: 1,
      tags: [],
      title: 'Title of a channel',
    },
  ];

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const createSortHandler = property => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Layout>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" variant="h4">
            Your channels
          </Typography>
          <div className={classes.grow} />
          <Button
            color="primary"
            // onClick={e => setNewAnchor(e.currentTarget)}
            startIcon={<AddCircleIcon />}
            variant="contained"
          >
            New
          </Button>
        </Toolbar>
        <Container disableGutters>
          {channels?.length > 0 ? (
            <TableContainer>
              <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={createSortHandler('name')}
                      >
                        Name{' '}
                        {orderBy === 'name' ? (
                          <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Editors</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(channels, getComparator(order, orderBy)).map(
                    ({ id, description, editors, tags, title }) => {
                      return (
                        <TableRow key={id}>
                          <TableCell>
                            <Typography variant="body1">{title}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {description}
                            </Typography>
                          </TableCell>
                          <TableCell>{tags.map((tag, i) => (i === tags.length - 1 ? tag : `${tag}, `))}</TableCell>
                          <TableCell>{editors.map(editor => editor)}</TableCell>
                          <TableCell align="right">
                            <IconButton edge="end" size="small">
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    },
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>Create your first channel</>
          )}
        </Container>
      </Layout>
    </>
  );
}
