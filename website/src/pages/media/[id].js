import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import { withSSRContext, Storage, DataStore } from 'aws-amplify';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import TextField from '@material-ui/core/TextField';
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
  stage: {
    alignContent: 'center',
    alignItems: 'center',
    background: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
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
  textField: {
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up('small')]: {
      marginBottom: theme.spacing(1),
    },
  },
  title: {
    ...theme.typography.h6,
    cursor: 'text',
  },
  description: {
    ...theme.typography.body2,
    cursor: 'text',
  },
  tags: {
    ...theme.typography.caption,
  },
  primaryButton: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[2],
      color: theme.palette.primary.contrastText,
    },
  },
  chip: {
    margin: theme.spacing(0.3, 0.3, 0.3, 0),
  },
  primaryMenuItem: {
    color: theme.palette.primary.main,
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const MediaPage = initialData => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();

  const { id } = router.query;
  const { user } = initialData;

  const initialMedia = useMemo(() => deserializeModel(Media, initialData.media), [initialData]);

  const [media, setMedia] = useState(initialMedia);
  const [url, setUrl] = useState();

  const [editable, setEditable] = useState(null);
  const [title, setTitle] = useState(initialMedia.title);
  const [description, setDescription] = useState(initialMedia.description);
  const [tags, setTags] = useState(initialMedia.tags);

  const [transcriptActionsAnchorEl, setTranscriptActionsAnchorEl] = useState(null);

  const isOwner = user?.id === media.owner;

  // FIXME
  const { channels = [], createdAt, transcripts = [] } = media ?? {};

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

  useEffect(() => {
    if (!media || !media.url) return;
    const signURL = async () => {
      const prefix = 's3://hyperpink-data/public/';
      if (media.url.startsWith(prefix)) {
        setUrl(await Storage.get(media.url.substring(prefix.length)));
      } else {
        setUrl(media.url);
      }
    };

    signURL();
  }, [media]);

  useEffect(() => {
    if (!media) return;
    setTitle(media.title);
    setDescription(media.description);
    setTags(media.tags);
  }, [media]);

  // const editTitle = useCallback(async () => {
  //   if (media.owner !== user.id) return alert('not your media!');
  //   const title = global.prompt('Edit Title', media.title);
  //   if (title) {
  //     setMedia(
  //       await DataStore.save(
  //         Media.copyOf(media, updated => {
  //           updated.title = title;
  //           updated.updatedAt = new Date().toISOString();
  //         }),
  //       ),
  //     );
  //   }
  // }, [media, user]);

  // TODO where to get them? all tags of the user?
  const allTags = [
    { id: 1, title: 'Remix' },
    { id: 1, title: 'Audio' },
  ];

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

  const isSmall = useMediaQuery(theme.breakpoints.up('md'));

  const onToggleTranscriptUpload = () => {
    setTranscriptActionsAnchorEl(null);
  };

  const onToggleTranscriptCreate = () => {
    setTranscriptActionsAnchorEl(null);
  };

  const onSave = useCallback(async () => {
    console.log('onSave:', { title }, { description }, { tags });

    await DataStore.save(
      Media.copyOf(media, updated => {
        updated.title = title;
        updated.description = description;
        updated.tags = tags;
      }),
    );

    setEditable(false);
  }, [media, title, description, tags]);

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
            <NextLink href="/media" passHref>
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
                onClick={e => setTranscriptActionsAnchorEl(e.currentTarget)}
              >
                <SubtitlesIcon />
              </IconButton>
            </Tooltip>
            {isOwner && (
              <Tooltip title={editable ? 'Save changes' : 'Edit information'}>
                <IconButton
                  className={editable ? classes.primaryButton : null}
                  color="primary"
                  edge="end"
                  onClick={editable ? onSave : () => setEditable(prevState => !prevState)}
                >
                  {editable ? <DoneIcon /> : <EditIcon />}
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Toolbar>
      <Grid container spacing={isSmall ? 4 : 2}>
        <Grid item xs={12} md={8}>
          {url ? (
            <div className={classes.stage}>
              <ReactPlayer height="auto" width="100%" url={url} controls className={classes.player} />
            </div>
          ) : null}
        </Grid>
        <Grid item container xs={12} md={4} direction="column" justify="space-between" spacing={2}>
          <Grid item>
            <TextField
              inputProps={{
                className: classes.title,
              }}
              classes={{ root: classes.textField }}
              color="primary"
              value={title}
              disabled={!editable}
              fullWidth
              margin="none"
              multiline
              name="title"
              required
              size="small"
              type="text"
              onChange={({ target: { value } }) => setTitle(value)} // TODO useCallback
            />
            {(isOwner || description.length > 1) && (
              <TextField
                inputProps={{
                  className: classes.description,
                }}
                classes={{ root: classes.textField }}
                color="primary"
                value={description}
                disabled={!editable}
                fullWidth
                multiline
                name="description"
                placeholder="Add description"
                required
                size="small"
                type="text"
                onChange={({ target: { value } }) => setDescription(value)} // TODO useCallback
              />
            )}
            {(isOwner || tags.length > 0) && (
              <Autocomplete
                ChipProps={{
                  className: classes.chip,
                  deleteIcon: editable ? <CloseIcon fontSize="small" /> : <></>,
                  size: 'small',
                  variant: 'outlined',
                }}
                autoComplete
                autoHighlight
                classes={{ root: classes.textField }}
                clearOnBlur
                clearOnEscape
                disabled={!editable}
                freeSolo
                id="tags-filled"
                multiple
                onChange={(e, v) => setTags(v)} // TODO useCallback
                options={allTags.map(option => option.title)}
                renderInput={params => (
                  <TextField
                    {...params}
                    className={classes.textField}
                    placeholder={tags.length === 0 ? 'Add tag' : null}
                    size="small"
                  />
                )}
                defaultValue={tags}
              />
            )}
            <Typography color="textSecondary" variant="caption">
              Added on {createdAt ? formattedCreatedAt : null}
              {channel && `in {channel}`}
            </Typography>
          </Grid>
          {transcripts?.length > 0 ? (
            <Grid item>
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
            </Grid>
          ) : (
            <Grid item>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                color="primary"
                fullWidth
                onClick={e => setTranscriptActionsAnchorEl(e.currentTarget)}
                size="large"
                startIcon={<SubtitlesIcon />}
                variant="contained"
              >
                Add transcript
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Menu
        anchorEl={transcriptActionsAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
        id="cc-actions-menu"
        keepMounted
        onClose={() => setTranscriptActionsAnchorEl(null)}
        open={Boolean(transcriptActionsAnchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        variant="menu"
      >
        <MenuItem divider className={classes.primaryMenuItem} dense onClick={onToggleTranscriptUpload}>
          Auto-transcribe
        </MenuItem>
        <MenuItem dense onClick={onToggleTranscriptUpload}>
          Upload existing
        </MenuItem>
        <MenuItem dense onClick={onToggleTranscriptCreate}>
          Type in manually
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
