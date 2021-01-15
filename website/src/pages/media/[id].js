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
import DoneIcon from '@material-ui/icons/Done';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
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

import { Media, User } from 'src/models';
import Layout from 'src/Layout';
import StatusFlag from './StatusFlag';
import TranscribeDialog from './TranscribeDialog';

// TODO where to get them? all tags of the user?
const ALL_TAGS = [
  { id: 1, title: 'Remix' },
  { id: 1, title: 'Audio' },
];

const TRANSCRIPTS = [
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
];

const useStyles = makeStyles(theme => ({
  toolbar: {
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(2, 0),
    },
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
  date: {
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.3, 0.3, 0.3, 0),
  },
  primaryButton: {
    background: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
  transcripts: {
    backgroundColor: theme.palette.background.well,
    maxHeight: '240px',
    overflowY: 'auto',
  },
  transcriptsSubheader: {
    background: rgba(theme.palette.background.default, 0.75),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

export default function MediaPage(initialData) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();

  const { id, t } = router.query;
  const { user } = initialData;

  const initialMedia = useMemo(() => deserializeModel(Media, initialData.media), [initialData]);

  const [description, setDescription] = useState(initialMedia.description);
  const [tDialogOpen, setTDialogOpen] = React.useState(false);
  const [editable, setEditable] = useState(null);
  const [media, setMedia] = useState(initialMedia);
  const [newTAnchor, setNewTAnchor] = useState(null);
  const [tActions, setTActions] = useState(null);
  const [tActionsAnchor, setTActionsAnchor] = useState(null);
  const [tags, setTags] = useState(initialMedia.tags);
  const [title, setTitle] = useState(initialMedia.title);
  const [url, setUrl] = useState();

  const isOwner = user?.id === media.owner;
  const isSmall = useMediaQuery(theme.breakpoints.up('md'));
  const { channels = [], createdAt } = media ?? {}; // FIXME
  const channel = null;

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

  const onToggleTranscriptUpload = () => {
    setNewTAnchor(null);
  };
  const onToggleTranscriptCreate = () => {
    setNewTAnchor(null);
  };
  const onToggleTranscriptTranscribe = () => {
    setNewTAnchor(null);
    setTDialogOpen(true);
  };
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
  const onTranscribe = payload => {
    const { language, speakers } = payload;
    console.log('onTranscribe', { language }, { speakers });
    setTDialogOpen(false);
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
                All audio
              </Button>
            </NextLink>
          </Grid>
          <Grid item xs={6} align="right">
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
              // classes={{ root: classes.textField }}
              margin="none"
              color="primary"
              value={title}
              disabled={!editable}
              fullWidth
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
                // classes={{ root: classes.textField }}
                margin="dense"
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
                  deleteIcon: <></>,
                  size: 'small',
                  variant: 'outlined',
                }}
                autoComplete
                autoHighlight
                clearOnBlur
                clearOnEscape
                disabled={!editable}
                freeSolo
                id="tags-filled"
                multiple
                onChange={(e, v) => setTags(v)} // TODO useCallback
                options={ALL_TAGS.map(option => option.title)}
                renderInput={params => (
                  <TextField
                    {...params}
                    margin="dense"
                    placeholder={tags.length === 0 ? 'Add tag' : null}
                    size="small"
                  />
                )}
                defaultValue={tags}
              />
            )}
            <Typography className={classes.date} color="textSecondary" display="block" variant="caption">
              Added on {createdAt ? formattedCreatedAt : null}
              {channel && `in {channel}`}
            </Typography>
          </Grid>

          <Grid item>
            {TRANSCRIPTS?.length > 0 && (
              <List
                aria-labelledby="nested-list-subheader"
                className={classes.transcripts}
                component="ul"
                dense
                disablePadding
                subheader={
                  <ListSubheader disableGutters className={classes.transcriptsSubheader} id="nested-list-subheader">
                    <Typography variant="overline">Transcripts</Typography>
                    <ListItemSecondaryAction>
                      <Tooltip title="Add transcript">
                        <span>
                          <IconButton
                            aria-controls="new-transcript-actions"
                            aria-haspopup="true"
                            color="primary"
                            size="small"
                            onClick={e => setNewTAnchor(e.currentTarget)}
                          >
                            <AddCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListSubheader>
                }
              >
                {TRANSCRIPTS.map(({ id, title, lang, status, statusMessage }) => {
                  const isDisabled = ['transcribing', 'aligning', 'error'].includes(status);
                  return (
                    <ListItem
                      button={!isDisabled}
                      key={id}
                      onClick={!isDisabled ? () => gotoTranscript(id) : null}
                      selected={t === id}
                    >
                      {/* <ListItemIcon>
                        <Tooltip title={statusMessage || ''}>
                          <span>
                            <StatusFlag status={status} />
                          </span>
                        </Tooltip>
                      </ListItemIcon> */}
                      <ListItemText primary={title} secondary={lang} />
                      <ListItemSecondaryAction>
                        <Tooltip title={isDisabled ? statusMessage || '' : 'Transcript Actions'}>
                          <span>
                            <IconButton
                              disabled={isDisabled}
                              onClick={!isDisabled ? e => onTActionsClick(e, id) : null}
                              size="small"
                            >
                              {isDisabled ? <StatusFlag status={status} /> : <MoreHorizIcon fontSize="small" />}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            )}
            {TRANSCRIPTS.length < 1 && (
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
            )}
          </Grid>
        </Grid>
      </Grid>
      <Menu
        anchorEl={newTAnchor}
        id="new-transcript-actions"
        onClose={() => setNewTAnchor(null)}
        open={Boolean(newTAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryButton} dense onClick={onToggleTranscriptTranscribe}>
          Auto-transcribe
        </MenuItem>
        <MenuItem dense divider onClick={onToggleTranscriptCreate}>
          Transcribe manually
        </MenuItem>
        <MenuItem dense onClick={onToggleTranscriptUpload}>
          Upload transcript
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={tActionsAnchor}
        id="transcript-actions"
        onClose={() => setTActionsAnchor(null)}
        open={Boolean(tActionsAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryButton} dense onClick={onMixTClick}>
          Mix
        </MenuItem>
        {isOwner && (
          <MenuItem dense onClick={onDeleteTClick}>
            Delete
          </MenuItem>
        )}
      </Menu>
      <TranscribeDialog onCancel={() => setTDialogOpen(false)} onConfirm={onTranscribe} open={tDialogOpen} />
    </Layout>
  );
}

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
