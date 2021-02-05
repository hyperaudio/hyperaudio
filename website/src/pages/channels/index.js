import NextLink from 'next/link';
import React from 'react';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';

import ChannelDialog from './ChannelDialog';

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

  const [channelDialog, setChannelDialog] = React.useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState(null);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selectedChannel, setSelectedChannel] = React.useState(null);

  const onOrderBy = property => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onClickEdit = () => {
    setSelectedChannel(channels.find(o => o.id === moreMenuAnchor.id));
    setChannelDialog(true);
    setMoreMenuAnchor(null);
  };

  const onReset = () => {
    setChannelDialog(false);
    setMoreMenuAnchor(null);
    setSelectedChannel(null);
  };

  const onSave = payload => {
    console.log('onSave:', { payload });
    onReset();
  };

  const menuProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    getContentAnchorEl: null,
    keepMounted: true,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    variant: 'menu',
  };

  console.log({ selectedChannel });

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
            onClick={() => setChannelDialog(true)}
            startIcon={<AddCircleOutlineIcon />}
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
                        onClick={onOrderBy('name')}
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
                    ({ id, description, editors, tags, title }) => (
                      <TableRow key={id}>
                        <TableCell>
                          <Typography noWrap>
                            <NextLink href="/mixes" passHref>
                              <Link noWrap variant="body1">
                                {title}
                              </Link>
                            </NextLink>
                          </Typography>
                          <Typography color="textSecondary" noWrap variant="caption">
                            {description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {tags.map((tag, i) => (
                            <span key={tag}>
                              <NextLink href="/mixes" passHref>
                                <Link>{tag}</Link>
                              </NextLink>
                              {i !== tags.length - 1 && <>, </>}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>{editors.map(editor => editor)}</TableCell>
                        <TableCell align="right">
                          <IconButton edge="end" onClick={e => setMoreMenuAnchor({ el: e.target, id })} size="small">
                            <MoreHorizIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>Create your first channel</>
          )}
        </Container>
      </Layout>
      <Menu
        anchorEl={moreMenuAnchor?.el}
        id="transcript-actions"
        onClose={onReset}
        open={Boolean(moreMenuAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryMenuItem} dense onClick={onClickEdit}>
          Edit details
        </MenuItem>
        <MenuItem
          className={classes.primaryMenuItem}
          dense
          divider
          // onClick={onRemixClick}
        >
          Manage editors
        </MenuItem>
        <MenuItem
          className={classes.primaryMenuItem}
          dense
          // onClick={onRemixClick}
        >
          Delete
        </MenuItem>
      </Menu>
      {channelDialog && (
        <ChannelDialog data={selectedChannel} onCancel={onReset} onConfirm={onSave} open={channelDialog} />
      )}
    </>
  );
}
