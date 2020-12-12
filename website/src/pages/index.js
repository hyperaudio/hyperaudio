import React, { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore, Predicates, SortDirection } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Pagination from '@material-ui/lab/Pagination';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Layout from 'src/Layout';
import { Channel, Media, User, UserChannel } from '../models';

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
  items: {
    listStyle: 'none',
    paddingLeft: 0,
    alignContent: 'stretch',
    alignItems: 'stretch',
  },
  item: {
    listStyle: 'none',
    position: 'relative',
  },
  head: {
    cursor: 'pointer',
  },
  card: {
    height: '100%',
  },
  thumb: {
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  cardMedia: {
    width: '100%',
  },
  cardContent: {
    padding: theme.spacing(1, 0.5),
  },
  cardActions: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    left: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: theme.zIndex.drawer,
    [theme.breakpoints.up('sm')]: {
      top: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
  paginationParent: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
    },
  },
}));

const Dashboard = initialData => {
  const classes = useStyles();
  const theme = useTheme();

  const router = useRouter();
  const {
    query: { page = 1 },
  } = router;

  const { pages } = initialData;

  const [media, setMedia] = useState(deserializeModel(Media, initialData.media));
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));

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
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography component="h1" gutterBottom variant="h5">
          Your media
        </Typography>
        <div className={classes.grow} />
        <NextLink href="/new/media">
          <Button color="primary">New Media</Button>
        </NextLink>
        <NextLink href="/new/channel">
          <Button color="primary">New Channel</Button>
        </NextLink>
      </Toolbar>
      <Grid className={classes.items} component="ol" container spacing={isSmall ? 4 : 2}>
        {media.map(({ id, title, description, metadata }) => (
          <Grid className={classes.item} component="li" item key={id} md={3} sm={4} xs={6}>
            <Card className={classes.card} elevation={0} square raised={false}>
              <NextLink href={`/media/${id}`}>
                <CardActionArea>
                  {metadata ? (
                    <CardMedia
                      className={classes.cardMedia}
                      component="img"
                      src={
                        JSON.parse(metadata)?.embedly?.thumbnail_url ??
                        JSON.parse(metadata)?.oembed?.thumbnail_url ??
                        'http://placekitten.com/320/180'
                      }
                      title={title}
                    />
                  ) : (
                    <CardMedia
                      className={classes.cardMedia}
                      component="img"
                      src="http://placekitten.com/320/180"
                      title={title}
                    />
                  )}
                </CardActionArea>
              </NextLink>
              <CardContent className={classes.cardContent}>
                <NextLink href={`/media/${id}`}>
                  <Typography component="h3" noWrap>
                    <Link href="#" variant="subtitle2">
                      {title}
                    </Link>
                  </Typography>
                </NextLink>
                <Typography color="textSecondary" component="p" gutterBottom noWrap variant="caption">
                  {description}
                </Typography>
              </CardContent>
              <CardActions className={classes.cardActions} disableSpacing>
                <Tooltip title="Actions…">
                  <IconButton color="secondary" size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className={classes.paginationParent}>
        <Pagination count={pages} defaultPage={1} page={parseInt(page, 10)} onChange={gotoPage} />
      </div>
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
    user = await DataStore.query(User, sub);
    userChannels = (await DataStore.query(UserChannel))
      .filter(c => c.user.id === user.id)
      .map(({ channel }) => channel);
    // userChannels = await DataStore.query(UserChannel);
    // userChannels = await DataStore.query(UserChannel, uc => uc.parent('eq', user.id));
  } catch (ignored) {}

  console.log({ user });
  return {
    props: {
      media: serializeModel(media),
      user: serializeModel(user),
      channels: serializeModel(channels),
      userChannels: serializeModel(userChannels),
      page,
      pages: global.pages,
    },
  };
};

export default Dashboard;
