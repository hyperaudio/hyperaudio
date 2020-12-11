import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import { withSSRContext, Storage, DataStore } from 'aws-amplify';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Layout from 'src/Layout';
import { Media, User } from 'src/models';

const useStyles = makeStyles(theme => ({
  toolbar: {
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(2, 0),
    },
  },
  grow: {
    flexGrow: 1,
  },
  meta: {
    order: 2,
  },
  metaChunk: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  theatre: {
    order: 1,
  },
  stage: {
    height: 'auto',
    width: 'auto',
  },
  player: {
    paddingTop: '56.25%',
    position: 'relative',
    '& > *': {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  },
  tags: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    marginLeft: theme.spacing(0.5) * -1,
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const MediaPage = initialData => {
  const classes = useStyles();
  const theme = useTheme();

  const router = useRouter();
  const { id } = router.query;

  const [ccActionsAnchorEl, setCCActionsAnchorEl] = useState(null);
  const [media, setMedia] = useState(deserializeModel(Media, initialData.media));
  const [moreActionsAnchorEl, setMoreActionsAnchorEl] = useState(null);
  const [url, setUrl] = useState();

  useEffect(() => {
    getMedia(setMedia, id);

    const subscription = DataStore.observe(Media).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      getMedia(setMedia, id);
    });

    const handleConnectionChange = () => navigator.onLine && getMedia(setMedia, id);
    window.addEventListener('online', handleConnectionChange);

    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(async () => {
    if (!media || !media.url) return;

    const prefix = 's3://hyperpink-data/public/';
    if (media.url.startsWith(prefix)) {
      setUrl(await Storage.get(media.url.substring(prefix.length)));
    } else {
      setUrl(media.url);
    }
  }, [media]);

  const editTitle = useCallback(async () => {
    const title = global.prompt('Edit Title', media.title);
    if (title) {
      setMedia(
        await DataStore.save(
          Media.copyOf(media, updated => {
            updated.title = title;
            updated.updatedAt = new Date().toISOString();
          }),
        ),
      );
    }
  }, [media]);

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

  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));

  const onToggleCCUpload = e => {
    setCCActionsAnchorEl(null);
  };
  const onToggleCCCreate = e => {
    setCCActionsAnchorEl(null);
  };
  const onToggleEdit = e => {
    setMoreActionsAnchorEl(null);
  };
  const onToggleSomething = e => {
    setMoreActionsAnchorEl(null);
  };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Toolbar className={classes.toolbar} disableGutters>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <NextLink href="/" passHref>
              <Button color="primary" startIcon={<ArrowBackIcon />}>
                All media
              </Button>
            </NextLink>
          </Grid>
          <Grid item xs={6} align="right">
            <Tooltip title="Add transcript">
              <IconButton
                aria-controls="cc-actions-menu"
                aria-haspopup="true"
                color="primary"
                onClick={e => setCCActionsAnchorEl(e.currentTarget)}
              >
                <SubtitlesIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More actions…">
              <IconButton
                edge="end"
                aria-controls="more-actions-menu"
                aria-haspopup="true"
                color="primary"
                onClick={e => setMoreActionsAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
      <Grid container spacing={isSmall ? 4 : 2}>
        <Grid container justify="space-between" direction="column" item xs={12} sm={4} className={classes.meta}>
          <Grid item>
            <div className={classes.metaChunk}>
              <Typography gutterBottom component="h1" variant="h6" onDoubleClick={editTitle}>
                <Tooltip title={title}>
                  <span>{title}</span>
                </Tooltip>
              </Typography>
              {description && (
                <Typography gutterBottom variant="body2">
                  {description}
                </Typography>
              )}
              <Typography color="textSecondary" variant="caption">
                Added on {createdAt ? formattedCreatedAt : null}
                {channel && `in {channel}`}
              </Typography>
            </div>
            {tags && (
              <div className={`${classes.tags} ${classes.metaChunk}`}>
                {tags?.map(tag => (
                  <Chip label={tag} key={tag} size="small" />
                ))}
              </div>
            )}
          </Grid>
          {transcripts?.length > 0 ? (
            <List
              component="ul"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" disableGutters disableSticky id="nested-list-subheader">
                  Available transcripts:
                </ListSubheader>
              }
            >
              {transcripts.map(transcript => (
                <ListItem button disableGutters divider key={transcript.id}>
                  <ListItemText primary={transcript.title} secondary={transcript.type} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Grid item>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                color="primary"
                fullWidth
                onClick={e => setCCActionsAnchorEl(e.currentTarget)}
                startIcon={<SubtitlesIcon />}
                variant="contained"
              >
                Add transcript
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={8} className={classes.theatre}>
          {url ? (
            <div className={classes.stage}>
              <ReactPlayer height="auto" width="100%" url={url} controls className={classes.player} />
            </div>
          ) : null}
        </Grid>
      </Grid>
      <Menu
        anchorEl={ccActionsAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
        id="cc-actions-menu"
        keepMounted
        onClose={() => setCCActionsAnchorEl(null)}
        open={Boolean(ccActionsAnchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        variant="menu"
      >
        <MenuItem dense onClick={onToggleCCUpload}>
          Upload
        </MenuItem>
        <MenuItem dense onClick={onToggleCCCreate}>
          Create
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={moreActionsAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
        id="more-actions-menu"
        keepMounted
        onClose={() => setMoreActionsAnchorEl(null)}
        open={Boolean(moreActionsAnchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        variant="menu"
      >
        <MenuItem dense onClick={onToggleEdit}>
          Edit
        </MenuItem>
        <MenuItem dense onClick={onToggleSomething}>
          Something
        </MenuItem>
      </Menu>
    </Layout>
  );
};

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);
  const {
    params: { id },
  } = context;

  const media = await DataStore.query(Media, id);
  if (!media) return { notFound: true };

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
