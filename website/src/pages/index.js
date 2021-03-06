/* eslint-disable consistent-return */
import NextLink from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { rgba } from 'polished';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore, Predicates, SortDirection } from 'aws-amplify';

// import Pagination from '@material-ui/lab/Pagination';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { ThemeProvider } from '@material-ui/core/styles';

import ChannelDialog from 'src/pages/channels/ChannelDialog';
import Layout from 'src/components/Layout';
import useTheme from 'src/hooks/useTheme';

import { Channel, Media, User, UserChannel, MediaChannel } from '../models';

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
    marginTop: theme.spacing(5),
    // marginBottom: theme.spacing(2),
  },
  primaryMenuItem: {
    color: theme.palette.primary.main,
    background: rgba(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
  toolbarButtons: {
    marginLeft: theme.spacing(2),
  },
  speedDial: {
    background: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
  grow: {
    flexGrow: 1,
  },
  block: {
    overflow: 'hidden',
    clear: 'both',
    padding: theme.spacing(5, 0),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(10, 0),
    },
  },
  blockTitle: {},
  items: {
    alignContent: 'stretch',
    alignItems: 'stretch',
    listStyle: 'none',
  },
  item: {
    listStyle: 'none',
    position: 'relative',
  },
  head: {
    cursor: 'pointer',
  },
  card: {
    background: 'transparent',
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

  paginationParent: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
    },
  },
}));

const Dashboard = props => {
  const classes = useStyles();
  const theme = useTheme('dark');

  const isMdUp = isWidthUp('md', props.width);
  const isSmUp = isWidthUp('sm', props.width);

  const router = useRouter();
  const {
    query: { page = 1 },
  } = router;

  const { channels, pages, user, userChannels, mediaChannels } = props;

  const [channelDialog, setChannelDialog] = useState(false);
  const [media, setMedia] = useState(deserializeModel(Media, props.media));
  const [newAnchor, setNewAnchor] = useState(null);

  const isMedium = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    listMedia(setMedia, page);
    const subscription = DataStore.observe(Media).subscribe(() => listMedia(setMedia, page));

    const handleConnectionChange = () => navigator.onLine && listMedia(setMedia, page);
    window.addEventListener('online', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [page]);

  const gotoPage = useCallback((e, page) => router.push(`?page=${page}`, undefined, { shallow: true }), [router]);

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

  const onChannelCreate = payload => {
    addNewChannel(payload);
    setChannelDialog(false);
    router.push('/channels');
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
        <Container>
          <Toolbar className={classes.toolbar} disableGutters>
            <Typography component="h1" variant="h4">
              All media
            </Typography>
            <div className={classes.grow} />
            <Button
              color="primary"
              onClick={e => setNewAnchor(e.currentTarget)}
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
            >
              New…
            </Button>
          </Toolbar>
          {mediaChannels.map(mc => {
            if (mc.media.length === 0 || mc.channel.title.length === 0) return null;
            return (
              <React.Fragment key={mc.channel.id}>
                <div className={classes.block}>
                  <Container maxWidth={isMdUp ? 'lg' : isSmUp ? 'sm' : 'xs'}>
                    <Grid container spacing={isMedium ? 8 : 4}>
                      <Grid item xs={12} md={4}>
                        <Typography className={classes.blockTitle} gutterBottom variant="h5" component="h2">
                          {mc.channel.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {mc.channel.description}
                        </Typography>
                      </Grid>
                      <Grid
                        className={classes.items}
                        // component="ol"
                        item
                        md={8}
                        spacing={isMedium ? 4 : 2}
                        xs={12}
                      >
                        <ThemeProvider theme={theme}>
                          <Grid container spacing={isMedium ? 4 : 2}>
                            {mc.media?.map(({ id, title, description, metadata }) => (
                              <Grid
                                className={classes.item}
                                // component="li"
                                item
                                key={id}
                                xs={6}
                                sm={4}
                              >
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
                                        <Link href={`/media/${id}`} variant="subtitle2">
                                          {title}
                                        </Link>
                                      </Typography>
                                    </NextLink>
                                    <Typography
                                      color="textSecondary"
                                      component="p"
                                      gutterBottom
                                      noWrap
                                      variant="caption"
                                    >
                                      {description}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </ThemeProvider>
                      </Grid>
                    </Grid>
                  </Container>
                </div>
                <Divider />
              </React.Fragment>
            );
          })}
        </Container>
        {/* <div className={classes.paginationParent}>
          <Pagination count={pages} defaultPage={1} page={parseInt(page, 10)} onChange={gotoPage} />
        </div> */}
      </Layout>
      <Menu
        {...menuProps}
        anchorEl={newAnchor}
        id="new-actions"
        onClose={() => setNewAnchor(null)}
        open={Boolean(newAnchor)}
      >
        <NextLink href="/new/media" passHref>
          <MenuItem className={classes.primaryMenuItem} dense>
            Media
          </MenuItem>
        </NextLink>
        <MenuItem
          dense
          onClick={() => {
            setNewAnchor(null);
            setChannelDialog(true);
          }}
        >
          Channel
        </MenuItem>
      </Menu>
      {channelDialog && (
        <ChannelDialog onCancel={() => setChannelDialog(false)} onConfirm={onChannelCreate} open={channelDialog} />
      )}
    </>
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
  let userChannels = [];
  let mediaChannels = [];

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

  mediaChannels = Object.values(
    serializeModel(await DataStore.query(MediaChannel)).reduce((acc, { channel, media }) => {
      const entry = acc[channel.id] ?? { channel, media: [] };
      if (!entry.media.find(m => m.id === media.id)) entry.media.push(media);
      entry.media.sort(({ updatedAt: a }, { updatedAt: b }) => new Date(b).getTime() - new Date(a).getTime());

      acc[channel.id] = entry;
      return acc;
    }, {}),
  ).sort(
    ({ media: [{ updatedAt: a }] }, { media: [{ updatedAt: b }] }) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return {
    props: {
      media: serializeModel(media),
      user: serializeModel(user),
      channels: serializeModel(channels),
      userChannels: serializeModel(userChannels),
      mediaChannels,
      page,
      pages: global.pages,
    },
  };
};

export default withWidth()(Dashboard);
