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

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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

import DeleteDialog from './DeleteDialog';
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
  speedDial: {
    background: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
  primaryMenuItem: {
    color: theme.palette.primary.main,
    background: rgba(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
  transcripts: {
    backgroundColor: theme.palette.background.well,
    maxHeight: '240px',
    overflowY: 'auto',
  },
  transcriptsSubheader: {
    background: rgba(theme.palette.background.default, theme.palette.background.defaultOpacity),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

export default function MediaPage(initialData) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();

  const { id, transcript } = router.query;
  const { user } = initialData;

  const initialMedia = useMemo(() => deserializeModel(Media, initialData.media), [initialData]);

  const [editable, setEditable] = useState(null);
  const [description, setDescription] = useState(initialMedia.description);
  const [media, setMedia] = useState(initialMedia);
  const [tags, setTags] = useState(initialMedia.tags);
  const [title, setTitle] = useState(initialMedia.title);
  const [url, setUrl] = useState();

  const [actionableTranscript, setActionableTranscript] = useState();
  const [transcribeDialogOpen, setTranscribeDialogOpen] = React.useState();
  const [transcribeMenuAnchor, setTranscribeMenuAnchor] = useState();
  const [transcriptDeleteDialogOpen, setTranscriptDeleteDialogOpen] = React.useState();
  const [transcriptMenuAnchor, setTranscriptMenuAnchor] = useState();

  const isOwner = user?.id === media.owner;
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
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

  const onReset = () => {
    setActionableTranscript(null);
    setTranscribeDialogOpen(false);
    setTranscribeMenuAnchor(null);
    setTranscriptDeleteDialogOpen(false);
    setTranscriptMenuAnchor(null);
  };
  const onTranscriptMenuOpen = id => e => {
    setActionableTranscript(TRANSCRIPTS.find(o => o.id === id));
    setTranscriptMenuAnchor(e.currentTarget);
  };
  const onRemixClick = () => {
    console.log('onRemixClick', { actionableTranscript });
    onReset();
  };
  const onDeleteConfirm = () => {
    console.log('onDeleteConfirm', actionableTranscript);
    onReset();
  };
  const onTranscribeClick = () => {
    setTranscribeDialogOpen(true);
    setTranscribeMenuAnchor(null);
  };
  const onTranscribeConfirm = payload => {
    const { language, speakers } = payload;
    console.log('onTranscribeConfirm', { language }, { speakers });
    onReset();
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
          query: { transcript },
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
  const textFieldProps = {
    color: 'primary',
    disabled: !editable,
    fullWidth: true,
    margin: 'none',
    multiline: true,
    size: 'small',
    type: 'text',
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
            {isOwner && (
              <Tooltip title={editable ? 'Save changes' : 'Edit information'}>
                <span>
                  <IconButton
                    className={editable ? classes.speedDial : null}
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
      <Grid container spacing={isMedium ? 4 : 2}>
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
              {...textFieldProps}
              inputProps={{
                className: classes.title,
              }}
              margin="none"
              name="title"
              onChange={({ target: { value } }) => setTitle(value)} // TODO useCallback
              required
              value={title}
            />
            {(isOwner || description.length > 0) && (
              <TextField
                {...textFieldProps}
                inputProps={{
                  className: classes.description,
                }}
                margin="dense"
                name="description"
                onChange={({ target: { value } }) => setDescription(value)} // TODO useCallback
                placeholder="Add description"
                required
                value={description}
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
                  <ListSubheader className={classes.transcriptsSubheader} id="nested-list-subheader">
                    <Typography variant="overline">Available transcripts</Typography>
                    <ListItemSecondaryAction>
                      <Tooltip title="Add transcript">
                        <span>
                          <IconButton
                            aria-controls="new-transcript-actions"
                            aria-haspopup="true"
                            color="primary"
                            size="small"
                            onClick={e => setTranscribeMenuAnchor(e.currentTarget)}
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
                      selected={transcript === id}
                    >
                      <ListItemText primary={title} secondary={lang} />
                      <ListItemSecondaryAction>
                        <Tooltip title={isDisabled ? statusMessage || '' : 'Transcript Actions'}>
                          <span>
                            <IconButton
                              disabled={isDisabled}
                              onClick={!isDisabled ? onTranscriptMenuOpen(id) : null}
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
                onClick={e => setTranscribeMenuAnchor(e.currentTarget)}
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
      {transcript ? <h4>Transcript {transcript} View</h4> : null}
      <Menu
        anchorEl={transcribeMenuAnchor}
        id="new-transcript-actions"
        onClose={onReset}
        open={Boolean(transcribeMenuAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryMenuItem} dense onClick={onTranscribeClick}>
          Auto-transcribe
        </MenuItem>
        <MenuItem dense divider onClick={() => console.log('onTypeInTranscriptClick')}>
          Transcribe manually
        </MenuItem>
        <MenuItem dense onClick={() => console.log('onUploadTranscriptClick')}>
          Upload transcript
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={transcriptMenuAnchor}
        id="transcript-actions"
        onClose={onReset}
        open={Boolean(transcriptMenuAnchor)}
        {...menuProps}
      >
        <MenuItem className={classes.primaryMenuItem} dense divider={isOwner} onClick={onRemixClick}>
          Mix
        </MenuItem>
        {isOwner && (
          <MenuItem dense onClick={actionableTranscript ? () => setTranscriptDeleteDialogOpen(true) : null}>
            Delete
          </MenuItem>
        )}
      </Menu>
      <DeleteDialog
        onCancel={onReset}
        onConfirm={onDeleteConfirm}
        open={transcriptDeleteDialogOpen}
        transcript={actionableTranscript}
      />
      <TranscribeDialog onCancel={onReset} onConfirm={onTranscribeConfirm} open={transcribeDialogOpen} />
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
