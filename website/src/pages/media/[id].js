/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactPlayer from 'react-player';
import { rgba } from 'polished';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';
import { useRouter } from 'next/router';
import { withSSRContext, DataStore, Predicates, SortDirection } from 'aws-amplify';
import axios from 'axios';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import withStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import { Media, User, UserChannel, MediaChannel, Channel, Transcript } from 'src/models';
import Layout from 'src/Layout';
import getDarkTheme from 'src/themes/getDarkTheme';

import DeleteDialog from 'src/dialogs/DeleteDialog';
import StatusFlag from './StatusFlag';
import Footer from 'src/components/Footer';
import TranscribeDialog from './TranscribeDialog';

// import Transcript from '../../components/transcript/Transcript';

// TODO where to get them? all tags of the user?
const ALL_TAGS = ['Remix', 'Audio'];

const useStyles = makeStyles(theme => ({
  root: {
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
  },
  theatre: {
    // left: 0,
    // position: 'absolute',
    // right: 0,
    // top: 0,
    background: theme.palette.background.dark,
    lineHeight: 0,
  },
  theatreChild: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  stage: {
    position: 'relative',
    // background: 'yellow',
    [theme.breakpoints.up('md')]: {
      flex: `0 0 ${(100 / 3) * 2}%`,
    },
  },
  player: {
    opacity: 0.5,
    '& > *': {
      paddingTop: '56.25%',
      position: 'relative',
    },
    '& > * > *': {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2, 1),
    },
  },
  titles: {
    [theme.breakpoints.up('md')]: {
      color: theme.palette.background.paper,
      display: 'flex',
      flex: `0 0 ${100 / 3}%`,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 1),
      '& > *': {
        width: '100%',
      },
    },
    padding: theme.spacing(1),
  },
  transcript: {
    overflowY: 'auto',
  },
  push: {
    ...theme.mixins.toolbar,
  },

  // OLD

  toolbar: {
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(2, 0),
    },
  },
  title: {
    ...theme.typography.h5,
    cursor: 'text',
  },
  description: {
    cursor: 'text',
  },
  date: {
    marginTop: theme.spacing(1),
  },
  chip: { margin: theme.spacing(0.3, 0.3, 0.3, 0) },
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
    maxHeight: '240px',
    overflowY: 'auto',
  },
  transcriptsSubheader: {
    background: rgba(theme.palette.background.dark, theme.palette.background.defaultOpacity),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));

const MediaPage = initialData => {
  const classes = useStyles();
  const router = useRouter();
  const darkTheme = getDarkTheme();

  const { id, transcript } = router.query;
  const { user, channels, transcripts = [] } = initialData;

  const initialMedia = useMemo(() => deserializeModel(Media, initialData.media), [initialData]);
  const userChannels = useMemo(() => deserializeModel(UserChannel, initialData.userChannels), [initialData]);
  const mediaChannel = useMemo(() => deserializeModel(MediaChannel, initialData.mediaChannel)?.pop(), [initialData]);
  // console.log({ userChannels, mediaChannel, channels, transcripts });

  const [channel, setChannel] = useState(mediaChannel?.channel || null);
  const [description, setDescription] = useState(initialMedia.description || null);
  const [editable, setEditable] = useState(false);
  const [media, setMedia] = useState(initialMedia);
  const [tags, setTags] = useState(initialMedia.tags || null);
  const [title, setTitle] = useState(initialMedia.title);
  const [url, setUrl] = useState();

  const [actionableTranscript, setActionableTranscript] = useState();
  const [transcribeDialogOpen, setTranscribeDialogOpen] = useState();
  const [transcribeMenuAnchor, setTranscribeMenuAnchor] = useState();
  const [transcriptDeleteDialogOpen, setTranscriptDeleteDialogOpen] = useState();
  const [transcriptMenuAnchor, setTranscriptMenuAnchor] = useState();

  // FIXME
  const type = 'video';
  const config = useMemo(
    () => ({
      file: {
        forceAudio: type === 'audio',
        forceVideo: type === 'video',
      },
    }),
    [type],
  );

  const player = useRef();
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackRate] = useState(1);

  const onPlay = useCallback(() => setPlaying(true), [setPlaying]);
  const onPause = useCallback(() => setPlaying(false), [setPlaying]);
  const onDuration = useCallback(d => setDuration(d), [setDuration]);
  const onProgress = useCallback(({ playedSeconds }) => setProgress(playedSeconds), [setProgress]);
  const onReady = useCallback(() => setReady(true), [setReady]);
  const onError = useCallback(() => setReady(false), [setReady]);

  const isOwner = user?.id === media.owner;
  const { createdAt } = media ?? {}; // FIXME
  // const channel = null;

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
    setActionableTranscript(transcripts.find(o => o.id === id));
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
    if (channel && !mediaChannel) {
      await DataStore.save(new MediaChannel({ media, channel }));
    } else if (channel) {
      await DataStore.save(
        MediaChannel.copyOf(mediaChannel, updated => {
          updated.channel = channel;
        }),
      );
    } else if (!channel && mediaChannel) {
      await DataStore.delete(mediaChannel);
    }
    setEditable(false);
  }, [media, title, description, tags, channel, mediaChannel]);

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

  // find 1st lang: 'en-US', status: 'transcribed' and navigate
  useEffect(() => {
    if (transcript) return;

    const t = transcripts.find(({ lang, status }) => lang === 'en-US' && status === 'transcribed');
    if (!t) return;

    router.push(
      {
        pathname: `/media/${id}`,
        query: { transcript: t.id },
      },
      undefined,
      { shallow: true },
    );
  }, [transcript, id, router]);

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

  const menuProps = useMemo(
    () => ({
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
    }),
    [],
  );

  const textFieldProps = useMemo(
    () => ({
      color: 'primary',
      disabled: !editable,
      fullWidth: true,
      margin: 'none',
      multiline: true,
      size: 'small',
      type: 'text',
    }),
    [editable],
  );

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <div className={classes.root}>
        <ThemeProvider theme={darkTheme}>
          <div className={classes.push} />
          <div className={classes.theatre}>
            <Container className={classes.theatreChild} maxWidth="md">
              <div className={classes.stage}>
                {Boolean(url) && (
                  <>
                    {/* <img src="/assets/stage-16x9.png" width="100%" alt="" /> */}
                    <div className={classes.player}>
                      <ReactPlayer
                        controls
                        ref={player}
                        height="auto"
                        width="100%"
                        progressInterval={75}
                        {...{
                          url,
                          config,
                          playing,
                          onPlay,
                          onPause,
                          onDuration,
                          onProgress,
                          onReady,
                          onError,
                          playbackRate,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={classes.titles}>
                <Hidden smDown>
                  <div className={classes.titlesHd}>
                    <div>
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
                      <Hidden smDown>
                        {(isOwner || description?.length > 0) && (
                          <TextField
                            {...textFieldProps}
                            inputProps={{
                              className: classes.description,
                            }}
                            label="Description:"
                            margin="dense"
                            name="description"
                            onChange={({ target: { value } }) => setDescription(value)} // TODO useCallback
                            placeholder="Add description"
                            value={description ?? ''}
                          />
                        )}
                        {(isOwner || channel?.length > 0) && (
                          <Autocomplete
                            autoComplete
                            autoHighlight
                            clearOnBlur
                            clearOnEscape
                            disabled={!editable}
                            getOptionLabel={option => `${option.title}`}
                            id="channel"
                            onChange={(event, newValue) => setChannel(newValue)}
                            options={userChannels}
                            popupIcon={<></>}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label="Channel"
                                margin="dense"
                                placeholder={!channel ? 'Assign to channel' : ''}
                              />
                            )}
                            selectOnFocus
                            size="small"
                            value={channel}
                          />
                        )}
                        {(isOwner || tags?.length > 0) && (
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
                            getOptionLabel={option => `${option}`}
                            id="tags"
                            multiple
                            onChange={(event, newValue) => setTags(newValue)}
                            options={ALL_TAGS}
                            popupIcon={<></>}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label="Tags:"
                                margin="dense"
                                placeholder={!tags || tags?.length === 0 ? 'Add tags' : ''}
                              />
                            )}
                            selectOnFocus
                            size="small"
                            value={tags}
                          />
                        )}
                        <Typography className={classes.date} color="textSecondary" display="block" variant="caption">
                          Added on {createdAt ? formattedCreatedAt : null}
                        </Typography>
                      </Hidden>
                    </div>
                  </div>
                  <div className={classes.titlesFt}>
                    {transcripts?.length > 0 && (
                      <List
                        aria-labelledby="nested-list-subheader"
                        className={classes.transcripts}
                        component="ul"
                        dense
                        disablePadding
                        subheader={
                          <ListSubheader className={classes.transcriptsSubheader} id="nested-list-subheader">
                            <Typography variant="overline" color="inherit">
                              Available transcripts
                            </Typography>
                            {/* <ListItemSecondaryAction> // TODO: Resurrect this
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
                    </ListItemSecondaryAction> */}
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
                              selected={transcript === id}
                            >
                              <ListItemText primary={title} secondary={lang} />
                              {/* <ListItemSecondaryAction> // TODO: Resurrect this
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
                          </ListItemSecondaryAction> */}
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                    {transcripts?.length < 1 && (
                      <>
                        {/* <Button // TODO: Resurrect this
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
              </Button> */}
                      </>
                    )}
                  </div>
                </Hidden>
                <Hidden mdUp>
                  {transcript?.length > 0 && (
                    <TextField
                      fullWidth
                      id="outlined-select-currency"
                      margin="none"
                      onChange={e => gotoTranscript(e.target)}
                      required
                      select
                      value={transcript}
                      variant="outlined"
                      SelectProps={{
                        MenuProps: {
                          MenuListProps: {
                            dense: true,
                          },
                        },
                      }}
                      size="small"
                    >
                      {transcripts.map(({ id, title, lang, status, statusMessage }) => (
                        <MenuItem key={id} selected={transcript === id} value={id}>
                          <ListItemText primary={`${lang}: ${title}`} />
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Hidden>
              </div>
            </Container>
          </div>
        </ThemeProvider>
        <div className={classes.transcript}>
          {/* <div className={classes.push} /> */}
          {/* <img src="/assets/stage-16x9.png" style={{ width: '100%' }} alt="" /> */}
          {Boolean(transcript) && (
            <Container maxWidth="sm">
              <TranscriptLoader
                transcripts={transcripts}
                id={transcript}
                time={progress}
                playing={playing}
                setPlaying={setPlaying}
                player={player}
              />
            </Container>
          )}
        </div>
      </div>
    </Layout>
  );
};

const TranscriptLoader = ({ transcripts, id, time, player, playing, setPlaying }) => {
  const metadata = useMemo(() => transcripts.find(({ id: _id }) => _id === id), [id, transcripts]);
  const [transcript, setTranscript] = useState();

  useEffect(() => {
    if (!metadata.url) return setTranscript(null);

    const loadTranscript = async () => {
      const { data } = await axios.request({
        method: 'get',
        url: metadata.url,
      });

      setTranscript(data);
    };
    loadTranscript();
  }, [metadata]);

  const ht1 = useRef();
  const onPlay = useRef();
  const onPause = useRef();

  const hypermedia = {
    getAttribute: () => 'ha2',
    currentTime: time,
    getCurrentTime: () => time,
    seekTo: t => {
      player.current?.seekTo(t, 'seconds');
    },
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    onPlay: cb => {
      onPlay.current = cb;
    },
    onPause: cb => {
      onPause.current = cb;
    },
  };

  useEffect(() => {
    window.currentTime = time;
    if (onPlay.current) onPlay.current();
  }, [time]);

  useEffect(() => {
    if (playing && onPlay.current) onPlay.current();
    if (!playing && onPause.current) onPause.current();
  }, [playing]);

  useEffect(() => {
    if (ht1.current) return;
    if (!transcript) return;
    if (!document.querySelector('span[data-m]')) return;

    ht1.current = window.hyperaudiolite();
    // ht1.current.setScrollParameters(<duration>, <delay>, <offset>, <container>);
    ht1.current.setScrollParameters(800, 0, -284, null);
    ht1.current.init('hypertranscript', hypermedia, false, true);
  }, [transcript, ht1]);

  return metadata ? (
    <div id="hypertranscript" className="hyperaudio-transcript">
      <article>
        <section>
          {transcript?.content?.paragraphs?.map(({ speaker, start, end, words }, i) => (
            <p key={`${i}-${start}-${end}`}>
              <span data-m={start * 1e3} data-d={0} className="speaker">
                {speaker}:{' '}
              </span>
              {words.map(({ start, end, text }, i) => (
                <span data-m={start} data-d={end - start} key={`${i}-${start}-${end}`}>{`${text} `}</span>
              ))}
            </p>
          ))}
        </section>
      </article>
    </div>
  ) : null;
};

export const getServerSideProps = async context => {
  const { Auth, DataStore } = withSSRContext(context);
  const {
    params: { id },
  } = context;

  const media = await DataStore.query(Media, id);
  if (!media) return { notFound: true };

  let user = null;
  let channels = [];
  let userChannels = [];
  let mediaChannel = null;
  let transcripts = [];

  try {
    const {
      attributes: { sub },
    } = await Auth.currentAuthenticatedUser();
    user = serializeModel(await DataStore.query(User, sub));

    channels = serializeModel(
      (
        await DataStore.query(Channel, Predicates.ALL, {
          // page: parseInt(page, 10) - 1,
          // limit: PAGINATION_LIMIT,
          sort: s => s.updatedAt(SortDirection.DESCENDING).title(SortDirection.DESCENDING),
        })
      ).filter(({ editors }) => editors?.includes(user.id)),
    );

    userChannels = serializeModel(
      (await DataStore.query(UserChannel)).filter(c => c.user.id === user.id).map(({ channel }) => channel),
    ).concat(channels);
  } catch (ignored) {}

  mediaChannel = serializeModel((await DataStore.query(MediaChannel)).filter(({ media: { id: _id } }) => _id === id));
  transcripts = serializeModel((await DataStore.query(Transcript)).filter(({ media }) => media === id));
  // console.log({ user });

  return {
    props: {
      media: serializeModel(media),
      user,
      channels,
      transcripts,
      userChannels,
      mediaChannel,
    },
  };
};

export default MediaPage;
