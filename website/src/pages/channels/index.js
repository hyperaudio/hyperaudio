import React, { useCallback, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Avatar from '@material-ui/core/Avatar';
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
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';

import { Channel, User, UserChannel } from '../../models';

import EditorsDialog from './EditorsDialog';
import ChannelDialog from './ChannelDialog';
import DeleteDialog from 'src/dialogs/DeleteDialog';

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
  editors: {
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  editor: {
    marginRight: theme.spacing(0.25),
    listStyle: 'none',
  },
  avatar: {
    background: theme.palette.primary.light,
    fontSize: theme.typography.pxToRem(16),
    height: theme.spacing(4),
    lineHeight: theme.spacing(4),
    textTransform: 'uppercase',
    width: theme.spacing(4),
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

const getUserChannels = async (setChannels, user) =>
  setChannels((await DataStore.query(UserChannel)).filter(c => c.user.id === user.id).map(({ channel }) => channel));

export default function Channels({ user, userChannels, users }) {
  const classes = useStyles();

  const [channels, setChannels] = useState(userChannels ? deserializeModel(Channel, userChannels) : []);
  console.log({ user, channels, users });

  useEffect(() => {
    getUserChannels(setChannels, user);
    const subscription = DataStore.observe(UserChannel).subscribe(msg => {
      // console.log(msg.model, msg.opType, msg.element);
      getUserChannels(setChannels, user);
    });
    const handleConnectionChange = () => navigator.onLine && getUserChannels(setChannels, user);
    window.addEventListener('online', handleConnectionChange);
    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    getUserChannels(setChannels, user);
    const subscription = DataStore.observe(Channel).subscribe(msg => {
      // console.log(msg.model, msg.opType, msg.element);
      getUserChannels(setChannels, user);
    });
    const handleConnectionChange = () => navigator.onLine && getUserChannels(setChannels, user);
    window.addEventListener('online', handleConnectionChange);
    return () => subscription.unsubscribe();
  }, [user]);

  const [channelDialog, setChannelDialog] = React.useState();
  const [deleteDialog, setDeleteDialog] = React.useState();
  const [editorsDialog, setEditorsDialog] = React.useState();
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selectedChannel, setSelectedChannel] = React.useState();

  // const onAddNewChannel = useCallback(async () => {
  //   const channel = await DataStore.save(
  //     new Channel({ title, description, tags, metadata: JSON.stringify(metadata), owner: user.id }),
  //   );
  const addNewChannel = useCallback(
    async ({ title, description, tags = [], editors = [], metadata = {} }) => {
      const channel = await DataStore.save(
        new Channel({ title, description, tags, editors, metadata: JSON.stringify(metadata), owner: user.id }),
      );

      await DataStore.save(new UserChannel({ user, channel }));
    },
    [user],
  );

  const updateChannel = useCallback(async (channel, { title, description, tags = [] }) => {
    await DataStore.save(
      Channel.copyOf(channel, updated => {
        updated.title = title;
        updated.description = description;
        updated.tags = tags;
      }),
    );
  }, []);

  const updateChannelEditors = useCallback(async (channel, editors = []) => {
    await DataStore.save(
      Channel.copyOf(channel, updated => {
        updated.editors = editors;
      }),
    );
  }, []);

  const deleteChannel = useCallback(channel => DataStore.delete(channel), []);

  const onOrderByClick = property => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const onEditClick = () => {
    setSelectedChannel(channels.find(o => o.id === moreMenuAnchor.id));
    setChannelDialog(true);
  };
  const onEditorsClick = () => {
    setSelectedChannel(channels.find(o => o.id === moreMenuAnchor.id));
    setEditorsDialog(true);
  };
  const onDeleteClick = () => {
    setSelectedChannel(channels.find(o => o.id === moreMenuAnchor.id));
    setDeleteDialog(true);
  };

  const onReset = () => {
    setChannelDialog(false);
    setDeleteDialog(false);
    setEditorsDialog(false);
    setMoreMenuAnchor(null);
    setSelectedChannel(null);
  };
  const onSaveEditors = editors => {
    updateChannelEditors(selectedChannel, editors);
    onReset();
  };
  const onSaveDetails = payload => {
    if (selectedChannel) {
      updateChannel(selectedChannel, payload);
    } else {
      addNewChannel(payload);
    }
    onReset();
  };
  const onDelete = () => {
    deleteChannel(selectedChannel);
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
                        onClick={onOrderByClick('name')}
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
                          {tags?.map((tag, i) => (
                            <span key={tag}>
                              <NextLink href="/mixes" passHref>
                                <Link>{tag}</Link>
                              </NextLink>
                              {i !== tags.length - 1 && <>, </>}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>
                          <ul className={classes.editors}>
                            {users
                              .filter(o => editors?.includes(o.id))
                              .map(({ username }) => (
                                <li className={classes.editor}>
                                  <Tooltip title={username}>
                                    <Avatar className={classes.avatar}>{username.charAt(0)}</Avatar>
                                  </Tooltip>
                                </li>
                              ))}
                          </ul>
                        </TableCell>
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
        <MenuItem className={classes.primaryMenuItem} dense onClick={onEditClick}>
          Edit details
        </MenuItem>
        <MenuItem className={classes.primaryMenuItem} dense divider onClick={onEditorsClick}>
          Manage editors
        </MenuItem>
        <MenuItem className={classes.primaryMenuItem} dense onClick={onDeleteClick}>
          Delete
        </MenuItem>
      </Menu>
      {channelDialog && (
        <ChannelDialog data={selectedChannel} onCancel={onReset} onConfirm={onSaveDetails} open={channelDialog} />
      )}
      {editorsDialog && (
        <EditorsDialog
          data={selectedChannel}
          onCancel={onReset}
          onConfirm={onSaveEditors}
          open={editorsDialog}
          users={users}
        />
      )}
      {deleteDialog && (
        <DeleteDialog
          data={{ entity: 'channel', title: selectedChannel.title }}
          onCancel={onReset}
          onConfirm={onDelete}
          open={deleteDialog}
        />
      )}
    </>
  );
}

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();

    const user = serializeModel(await DataStore.query(User, sub));
    const userChannels = serializeModel(
      (await DataStore.query(UserChannel)).filter(c => c.user.id === user.id).map(({ channel }) => channel),
    );

    const users = serializeModel(await DataStore.query(User));

    return { props: { user, userChannels, users } };
  } catch (error) {
    return { redirect: { destination: '/auth/?redirect=/new/channel', permanent: false } };
  }
};
