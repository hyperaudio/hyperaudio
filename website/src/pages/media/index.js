import React, { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore, Predicates, SortDirection } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Pagination from '@material-ui/lab/Pagination';

import Layout from 'src/components/Layout';
import { Media, User, Channel, UserChannel } from '../../models';

const PAGINATION_LIMIT = 7;

const listMedia = async (setMedia, page) =>
  setMedia(
    await DataStore.query(Media, Predicates.ALL, {
      page: parseInt(page, 10) - 1,
      limit: PAGINATION_LIMIT,
      sort: s => s.updatedAt(SortDirection.DESCENDING).title(SortDirection.DESCENDING),
    }),
  );

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

const MediaPage = initialData => {
  const classes = useStyles();

  const router = useRouter();
  const {
    query: { page = 1 },
  } = router;

  const { pages } = initialData;

  const [media, setMedia] = useState(deserializeModel(Media, initialData.media));

  useEffect(() => {
    listMedia(setMedia, page);
    const subscription = DataStore.observe(Media).subscribe(() => listMedia(setMedia, page));

    const handleConnectionChange = () => navigator.onLine && listMedia(setMedia, page);
    window.addEventListener('online', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [page]);

  const gotoPage = useCallback((e, page) => router.push(`?page=${page}`, undefined, { shallow: true }), []);

  return (
    <Layout>
      <Container>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" variant="h4">
            Your media
          </Typography>
          <div className={classes.grow} />
          <NextLink href="/new/media">
            <Button variant="contained" color="primary">
              New Media
            </Button>
          </NextLink>
          <NextLink href="/new/channel">
            <Button variant="contained" color="primary">
              New Channel
            </Button>
          </NextLink>
        </Toolbar>
        <Paper>
          <List dense>
            {media.map(({ id, title, description }) => (
              <NextLink key={id} href={`/media/${id}`}>
                <ListItem button>
                  <ListItemText primary={title} secondary={description} primaryTypographyProps={{ color: 'primary' }} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NextLink>
            ))}
          </List>
          <Pagination count={pages} defaultPage={1} page={parseInt(page, 10)} onChange={gotoPage} />
        </Paper>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);
  const {
    query: { page = 1 },
  } = context;

  global.pages = global.pages ?? Math.ceil((await DataStore.query(Media, Predicates.ALL)).length / PAGINATION_LIMIT);

  const media = await DataStore.query(Media, Predicates.ALL, {
    page: parseInt(page, 10) - 1,
    limit: PAGINATION_LIMIT,
    sort: s => s.updatedAt(SortDirection.DESCENDING).title(SortDirection.DESCENDING),
  });

  const channels = await DataStore.query(Channel, Predicates.ALL, {
    // page: parseInt(page, 10) - 1,
    // limit: PAGINATION_LIMIT,
    sort: s => s.updatedAt(SortDirection.DESCENDING).title(SortDirection.DESCENDING),
  });

  let user = null;
  let userChannels = null;

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();
    user = serializeModel(await DataStore.query(User, sub));
    userChannels = (await DataStore.query(UserChannel))
      .filter(c => c.user.id === user.id)
      .map(({ channel }) => channel);
  } catch (ignored) {}

  console.log({ user });
  return {
    props: {
      media: serializeModel(media),
      user,
      channels: serializeModel(channels),
      userChannels: serializeModel(userChannels),
      page,
      pages: global.pages,
    },
  };
};

export default MediaPage;
