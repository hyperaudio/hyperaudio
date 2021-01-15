/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { rgba } from 'polished';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import { withSSRContext, Storage, DataStore } from 'aws-amplify';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
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
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  transcriptList: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
    maxHeight: '200px',
    overflowY: 'auto',
  },
  transcriptListSubh: {
    background: rgba(theme.palette.background.default, 0.75),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const DisplayStatus = ({ status }) => {
  switch (status) {
    case 'transcribing':
    case 'aligning':
      return <CircularProgress size={16} color="inherit" />;
    case 'transcribed':
    case 'aligned':
    case 'new':
      return <CheckIcon fontSize="small" />;
    case 'error':
      return <ErrorOutlineIcon fontSize="small" />;
    default:
      return <EditIcon fontSize="small" />;
  }
};

const MediaPage = initialData => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();

  const { id, t } = router.query;
  const { user } = initialData;

  const initialMedia = useMemo(() => deserializeModel(Media, initialData.media), [initialData]);

  const [media, setMedia] = useState(initialMedia);
  const [url, setUrl] = useState();

  const [editable, setEditable] = useState(null);
  const [title, setTitle] = useState(initialMedia.title);
  const [description, setDescription] = useState(initialMedia.description);
  const [tags, setTags] = useState(initialMedia.tags);

  const [tActions, setTActions] = useState(null);
  const [newTAnchor, setNewTAnchor] = useState(null);
  const [tActionsAnchor, setTActionsAnchor] = useState(null);

  const isOwner = user?.id === media.owner;

  // FIXME
  const { channels = [], createdAt } = media ?? {};
  const transcripts = [
    {
      id: '456787853567',
      title: 'Transcribed transcript',
      description: 'title and desc would be gleaned from media, but can be in different language on translation, etc',
      tags: [],
      lang: 'en-US',
      status: 'transcribed',
      type: 'TBD',
      createdAt: '2020-12-04T14:25:29.646Z',
      updatedAt: '2020-12-07T19:25:29.646Z',
    },
    {
      id: '456789877',
      title: 'New transcript',
      description: 'title and desc would be gleaned from media, but can be in different language on translation, etc',
      tags: [],
      lang: 'en-US',
      status: 'new',
      type: 'TBD',
      createdAt: '2020-12-04T14:25:29.646Z',
      updatedAt: '2020-12-07T19:25:29.646Z',
    },
    {
      id: '4567673567',
      title: 'Aligned transcript',
      description: 'title and desc would be gleaned from media, but can be in different language on translation, etc',
      tags: [],
      lang: 'en-US',
      status: 'aligned',
      type: 'TBD',
      createdAt: '2020-12-04T14:25:29.646Z',
      updatedAt: '2020-12-07T19:25:29.646Z',
    },
    {
      id: '45678987567',
      title: 'Aligning transcript',
      description: 'title and desc would be gleaned from media, but can be in different language on translation, etc',
      tags: [],
      lang: 'en-US',
      status: 'aligning',
      type: 'TBD',
      createdAt: '2020-12-04T14:25:29.646Z',
      updatedAt: '2020-12-07T19:25:29.646Z',
    },
    {
      id: '4567897853533347',
      title: 'Error transcript',
      description: 'title and desc would be gleaned from media, but can be in different language on translation, etc',
      tags: [],
      lang: 'en-US',
      status: 'error',
      type: 'TBD',
      createdAt: '2020-12-04T14:25:29.646Z',
      updatedAt: '2020-12-07T19:25:29.646Z',
    },
    {
      id: '98788983567',
      title: 'Transcribing transcript',
      description: 'foo bar baz',
      tags: [],
      lang: 'en-GB',
      type: 'TBD',
      status: 'transcribing', // status.endsWith('ing') -> spinner
      createdAt: '2021-01-04T12:25:29.646Z',
      updatedAt: '2021-01-07T13:25:29.646Z',
    },
  ];

  // console.log({ transcripts });

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
    setNewTAnchor(null);
  };

  const onToggleTranscriptCreate = () => {
    setNewTAnchor(null);
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

  const gotoTranscript = useCallback(
    transcript =>
      router.push(
        {
          pathname: `/media/${id}`,
          query: { t: transcript },
        },
        undefined,
        { shallow: true },
      ),
    [router, id],
  );

  const onTActionsClick = (e, id) => {
    e.stopPropagation();
    setTActionsAnchor(e.currentTarget);
    setTActions(id);
  };
  const onMixTClick = () => {
    if (!tActions) return;
    console.log('onMixTClick', tActions);
    setTActions(null);
    setTActionsAnchor(null);
  };
  const onDeleteTClick = () => {
    if (!tActions) return;
    console.log('onDeleteTClick', tActions);
    setTActions(null);
    setTActionsAnchor(null);
  };

  const menuProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    getContentAnchorEl: null,
    keepMounted: true,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    variant: 'menu',
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
            <NextLink href="/media" passHref>
              <Button color="primary" startIcon={<ArrowBackIcon />}>
                All media
              </Button>
            </NextLink>
          </Grid>
          <Grid item xs={6} align="right">
            <Tooltip title="Add transcript">
              <span>
                <IconButton
                  aria-controls="new-transcript-actions"
                  aria-haspopup="true"
                  color="primary"
                  onClick={e => setNewTAnchor(e.currentTarget)}
                >
                  <SubtitlesIcon />
                </IconButton>
              </span>
            </Tooltip>
            {isOwner && (
              <Tooltip title={editable ? 'Save changes' : 'Edit information'}>
                <span>
                  <IconButton
                    className={editable ? classes.primaryButton : null}
                    color="primary"
                    edge="end"
                    onClick={editable ? onSave : () => setEditable(prevState => !prevState)}
                  >
                    {editable ? <DoneIcon /> : <EditIcon />}
                  </IconButton>
                </span>
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
          <Grid item xs>
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

          <Grid item>
            {transcripts?.length > 0 && (
              <List
                aria-labelledby="nested-list-subheader"
                className={classes.transcriptList}
                component="ul"
                dense
                disablePadding
                subheader={
                  <ListSubheader disableGutters className={classes.transcriptListSubh} id="nested-list-subheader">
                    <Typography variant="overline">Available transcripts</Typography>
                  </ListSubheader>
                }
              >
                {transcripts.map(({ id, title, lang, status, statusMessage }) => {
                  const isDisabled = ['transcribing', 'aligning', 'error'].includes(status);
                  return (
                    <ListItem
                      button={!isDisabled}
                      key={id}
                      onClick={!isDisabled ? () => gotoTranscript(id) : null}
                      selected={t === id}
                    >
                      <ListItemIcon>
                        <Tooltip title={statusMessage || ''}>
                          <span>
                            <DisplayStatus status={status} />
                          </span>
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText primary={title} secondary={lang} />
                      <ListItemSecondaryAction>
                        <Tooltip title="Transcript actions">
                          <span>
                            <IconButton size="small" onClick={e => onTActionsClick(e, id)}>
                              <MoreHorizIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            )}
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              color="primary"
              fullWidth
              onClick={e => setNewTAnchor(e.currentTarget)}
              size="large"
              startIcon={<SubtitlesIcon />}
              variant="contained"
            >
              Add transcript
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* {t ? (
        <h1>Transcript {t} View</h1>
      ) : (
        <table>
          {transcripts.map(({ id, title, lang, status }) => (
            <tr key={id}>
              <td>
                <span onClick={() => gotoTranscript(id)}>{title}</span>
              </td>
              <td>{lang}</td>
              <td>{status}</td>
            </tr>
          ))}
        </table>
      )} */}
      <Menu
        anchorEl={newTAnchor}
        id="new-transcript-actions"
        onClose={() => setNewTAnchor(null)}
        open={Boolean(newTAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryMenuItem} dense onClick={onToggleTranscriptUpload}>
          Auto-transcribe
        </MenuItem>
        <MenuItem dense onClick={onToggleTranscriptUpload}>
          Upload existing
        </MenuItem>
        <MenuItem dense onClick={onToggleTranscriptCreate}>
          Type in manually
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={tActionsAnchor}
        id="transcript-actions"
        onClose={() => setTActionsAnchor(null)}
        open={Boolean(tActionsAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryMenuItem} dense onClick={onMixTClick}>
          Mix
        </MenuItem>
        {isOwner && (
          <MenuItem dense onClick={onDeleteTClick}>
            Delete
          </MenuItem>
        )}
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
