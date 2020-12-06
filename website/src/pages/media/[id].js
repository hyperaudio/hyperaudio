import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { withSSRContext, Storage, DataStore } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from 'src/Layout';
import { Media, User } from 'src/models';

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  actions: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      '& > *': {
        marginLeft: theme.spacing(2),
      },
    },
  },
  player: {
    paddingTop: '56.25%',
    position: 'relative',
    marginBottom: theme.spacing(2),
    '& > *': {
      position: 'absolute',
      top: 0,
    },
  },
  tags: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const MediaPage = initialData => {
  const classes = useStyles();

  const router = useRouter();
  const { id } = router.query;

  const [media, setMedia] = useState(deserializeModel(Media, initialData.media));
  const [url, setUrl] = useState();

  useEffect(() => {
    getMedia(setMedia, id);

    const subscription = DataStore.observe(Media).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      getMedia(setMedia, id);
    });

    const handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      console.log(condition);
      if (condition === 'online') {
        getMedia(setMedia, id);
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [setMedia, id]);

  useEffect(async () => {
    if (!media || !media.url) return;

    const prefix = 's3://hyperpink-data/public/';
    if (media.url.startsWith(prefix)) {
      setUrl(await Storage.get(media.url.substring(prefix.length)));
    } else {
      setUrl(media.url);
    }
  }, [media, setUrl]);

  const editTitle = useCallback(async () => {
    const title = global.prompt('Edit Title', media.title);
    if (title) {
      setMedia(
        await DataStore.save(
          Media.copyOf(media, updated => {
            updated.title = title;
          }),
        ),
      );
    }
  }, [media, setMedia]);

  // FIXME
  const { channels = [], createdAt, description = '', tags = [], title = '', transcripts = [] } = media ? media : {};

  const formattedCreatedAt = useMemo(
    () =>
      createdAt
        ? Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(createdAt))
        : null,
    [createdAt],
  );

  const channel = null;
  console.log({ tags });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Layout>
        <Toolbar className={classes.toolbar} disableGutters>
          <Typography component="h1" gutterBottom variant="h4" onDoubleClick={editTitle}>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.actions}>
            <Button color="primary" onClick={() => console.log('Import Transcript')}>
              Import transcript
            </Button>
            <Button variant="contained" color="primary" onClick={() => console.log('Transcribe')}>
              Transcribe
            </Button>
          </div>
        </Toolbar>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {url ? <ReactPlayer height="auto" width="auto" url={url} controls className={classes.player} /> : null}
            {description && (
              <Typography gutterBottom variant="body2">
                {description}
              </Typography>
            )}
            <Typography color="textSecondary" gutterBottom variant="body2">
              Added on {createdAt ? formattedCreatedAt : null}
              {channel && `in {channel}`}
            </Typography>
            <div className={classes.tags}>
              {tags?.map(tag => (
                <Chip label={tag} key={tag} size="small" />
              ))}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <List
              component="ul"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" disableGutters disableSticky id="nested-list-subheader">
                  Available transcripts:
                </ListSubheader>
              }
            >
              {transcripts ? ( // TODO: add actionable invitation if length = 0
                transcripts.map(transcript => (
                  <ListItem button disableGutters divider key={transcript.id}>
                    <ListItemText primary={transcript.title} secondary={transcript.type} />
                  </ListItem>
                ))
              ) : (
                <h6>loading</h6>
              )}
            </List>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export const getServerSideProps = async req => {
  const { Auth, DataStore } = withSSRContext(req);
  const {
    params: { id },
  } = req;

  const media = await DataStore.query(Media, id);
  let user = null;

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();
    user = serializeModel(await DataStore.query(User, sub));
  } catch (ignored) {}

  console.log({ user });

  return {
    props: {
      media: serializeModel(media),
      user,
    },
  };
};

export default MediaPage;

// <meta property="og:type" content="website" />
// <meta property="og:url" content="https://metatags.io/" />
// <meta property="og:title" content={title} />
// <meta property="og:description" content={description} />
// <meta
//   property="og:image"
//   content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
// />

// <meta property="twitter:card" content="summary_large_image" />
// <meta property="twitter:url" content="https://metatags.io/" />
// <meta property="twitter:title" content={title} />
// <meta property="twitter:description" content={description} />
// <meta
//   property="twitter:image"
//   content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
// />
