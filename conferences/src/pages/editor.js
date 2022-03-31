import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import ReactPlayer from 'react-player';
import { DataStore, Predicates, SortDirection, Storage } from 'aws-amplify';
import { isArray } from 'lodash';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import axios from 'axios';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { Editor, EditorState, convertFromRaw, createEntityMap } from '@hyperaudio/editor';

import { Media, Channel, Transcript, Remix, RemixMedia } from '../models';

const PREFIX = 'MediaPage';
const classes = {
  root: `${PREFIX}-root`,
  push: `${PREFIX}-push`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  [`& .${classes.push}`]: {
    ...theme.mixins.toolbar,
  },
}));

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, m => m.id('eq', id));
  setMedia(media?.[0]);
};

const getTranscripts = async (setTranscripts, id) =>
  setTranscripts((await DataStore.query(Transcript)).filter(t => t.media === id));

const EditorPage = ({ user, groups }) => {
  const router = useRouter();
  const {
    query: { media: mediaId, transcript: transcriptId },
  } = router;

  useEffect(() => {
    if (user === null)
      router.push(`/auth?redirect=${encodeURIComponent(`/editor?media=${mediaId}&transcript=${transcriptId}`)}`);
  }, [user, mediaId, transcriptId, router]);

  const [time, setTime] = useState(0);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState();
  const transcript = useMemo(() => transcripts.filter(t => t.id === transcriptId)?.[0], [transcriptId, transcripts]);

  useEffect(() => {
    if (!mediaId) return;
    getMedia(setMedia, mediaId);

    // const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setMedia, mediaId));
    // window.addEventListener('online', () => navigator.onLine && getMedia(setMedia, mediaId));
    // return () => subscription.unsubscribe();
  }, [mediaId]);

  useEffect(() => {
    if (!mediaId) return;
    getTranscripts(setTranscripts, mediaId);

    // const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setTranscripts, mediaId));
    // window.addEventListener('online', () => navigator.onLine && getTranscripts(setTranscripts, mediaId));
    // return () => subscription.unsubscribe();
  }, [mediaId]);

  useEffect(() => {
    if (!transcript || !media) return;
    console.log({ media, transcript });

    (async () => {
      let speakers;
      let blocks;

      try {
        // load saved version
        // const result = JSON.parse(
        //   await (
        //     await Storage.get(`transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`, {
        //       download: true,
        //     })
        //   ).Body.text(),
        // );

        const signedURL = await Storage.get(
          `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
          {
            level: 'public',
          },
        );

        // const result = await (await fetch(signedURL)).json();

        const result = (
          await axios.get(signedURL, {
            onDownloadProgress: progressEvent => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted === Infinity ? 100 : percentCompleted);
            },
          })
        ).data;

        speakers = result.speakers;
        blocks = result.blocks;
      } catch (error) {
        // use transcript's url
        // const result = await (await fetch(transcript.url)).json();
        // console.log(await axios.head(transcript.url));

        const result = (
          await axios.get(transcript.url, {
            onDownloadProgress: progressEvent => {
              // console.log(progressEvent);
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(
                progressEvent.lengthComputable ? (percentCompleted === Infinity ? 100 : percentCompleted) : 75,
              );
            },
          })
        ).data;

        speakers = result.speakers;
        blocks = result.blocks;
      }

      // let { speakers, blocks } = await (await fetch(transcript.url)).json();

      // fix simple list of speakers (array -> map)
      if (isArray(speakers)) {
        speakers = speakers.reduce((acc, speaker) => {
          const id = `S${nanoid(5)}`;
          return { ...acc, [id]: { name: speaker, id } };
        }, {});

        blocks = blocks.map(block => {
          const items = block.data.items.map((item, i, arr) => {
            const offset = arr.slice(0, i).reduce((acc, { text }) => acc + text.length + 1, 0);
            return { ...item, offset, length: item.text.length };
          });

          return {
            ...block,
            key: `B${nanoid(5)}`,
            data: {
              ...block.data,
              start: block.data.items?.[0]?.start ?? 0,
              end: block.data.items?.[block.data.items.length - 1]?.end ?? 0,
              speaker: Object.entries(speakers).find(([id, { name }]) => name === block.data.speaker)?.[0],
              items,
              stt: items,
            },
            entityRanges: [],
            inlineStyleRanges: [],
          };
        });
      }

      console.log({ speakers, blocks });
      setData({ speakers, blocks });
    })();
  }, [media, transcript]);

  const { speakers, blocks } = data ?? {};

  // console.log({ user, groups, mediaId, transcriptId, media, transcripts, transcript, data });

  const initialState = useMemo(
    () =>
      blocks && EditorState.createWithContent(convertFromRaw({ blocks: blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  const video = useRef();
  const seekTo = useCallback(
    time => {
      setSeekTime(time);
      if (video.current) video.current.seekTo(time, 'seconds');
    },
    [video],
  );

  const config = useMemo(
    () => ({
      file: {
        attributes: {
          poster: media?.poster,
        },
      },
    }),
    [media],
  );

  const [seekTime, setSeekTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const onProgress = useCallback(({ playedSeconds }) => setTime(playedSeconds), []);
  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const handleSliderChange = useCallback(
    (event, value) => {
      setSeekTime(value);
      if (video.current) video.current.seekTo(value, 'seconds');
    },
    [video],
  );
  const onBuffer = useCallback(() => setBuffering(true), []);
  const onBufferEnd = useCallback(() => setBuffering(false), []);
  const onDuration = useCallback(duration => setDuration(duration), []);

  const [draft, setDraft] = useState();
  const [saving, setSaving] = useState(0);
  const [savingProgress, setSavingProgress] = useState(0);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishing, setPublishing] = useState(0);

  const handleSave = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setSavingProgress(0);
    setSaving(2); // 3

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
      JSON.stringify(draft),
      {
        level: 'public',
        contentType: 'application/json',
        metadata: {
          user: user.id,
        },
        progressCallback(progress) {
          // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
          setSavingProgress(percentCompleted);
        },
      },
    );

    console.log(result);
    setSaving(1); // 2

    // version save

    // setSaving(1);
    setTimeout(() => setSaving(0), 500);

    const signedURL = await Storage.get(`transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`, {
      level: 'public',
    });
    console.log(signedURL);
  }, [draft, media, transcript, user]);

  const handlePublish = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setPublishingProgress(0);
    setPublishing(3);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
      JSON.stringify(draft),
      {
        level: 'public',
        contentType: 'application/json',
        metadata: {
          user: user.id,
        },
        progressCallback(progress) {
          // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentCompleted = Math.round((progress.loaded * 50) / progress.total);
          setPublishingProgress(percentCompleted);
        },
      },
    );

    console.log(result);
    setPublishing(2);

    // PUBLISH!
    const result2 = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json`,
      JSON.stringify(draft),
      {
        level: 'public',
        contentType: 'application/json',
        metadata: {
          user: user.id,
        },
        progressCallback(progress) {
          // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentCompleted = Math.round((progress.loaded * 50) / progress.total);
          setPublishingProgress(50 + percentCompleted);
        },
      },
    );

    console.log(result2);

    await DataStore.save(
      Transcript.copyOf(transcript, updated => {
        updated.status = { label: 'published' };
        // updated.url = result2.key;
      }),
    );

    await DataStore.save(
      Media.copyOf(media, updated => {
        updated.status = { label: 'published' };
      }),
    );

    setPublishing(1);
    setTimeout(() => setPublishing(0), 500);

    const signedURL = await Storage.get(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json`,
      {
        level: 'public',
      },
    );
    console.log(signedURL);
  }, [draft, media, transcript, user]);

  global.resetTranscript = useCallback(async () => {
    await Storage.remove(`transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`, {
      level: 'public',
    });
    console.log('please reload page');
  }, [media, transcript]);

  global.unpublishTranscript = useCallback(async () => {
    await DataStore.save(
      Transcript.copyOf(transcript, updated => {
        updated.status = { label: 'transcribed' };
      }),
    );

    await DataStore.save(
      Media.copyOf(media, updated => {
        updated.status = { label: 'transcribed' };
      }),
    );

    await Storage.remove(`transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json`, {
      level: 'public',
    });
  }, [media, transcript]);

  const div = useRef();
  const top = useMemo(() => div.current?.getBoundingClientRect().top ?? 500, [div]);

  return user ? (
    <Root className={classes.root}>
      <div className={classes.push} />
      <Toolbar>
        <Grid container>
          <Grid item sx={{ mr: 1 }}>
            <Button
              color="primary"
              startIcon={
                saving === 0 ? (
                  <SaveIcon fontSize="small" />
                ) : saving === 3 ? (
                  <HourglassEmptyIcon fontSize="small" />
                ) : saving === 2 ? (
                  <HourglassTopIcon fontSize="small" />
                ) : (
                  <HourglassBottomIcon fontSize="small" />
                )
              }
              onClick={handleSave}
              disabled={!draft || saving !== 0}
            >
              {saving ? `Saving ${savingProgress}%` : 'Save draft'}
            </Button>
          </Grid>
          <Grid item xs>
            <Container maxWidth="sm"></Container>
          </Grid>
          <Grid item sx={{ ml: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button
                color="primary"
                endIcon={
                  publishing === 0 ? (
                    <PublishIcon fontSize="small" />
                  ) : publishing === 3 ? (
                    <HourglassEmptyIcon fontSize="small" />
                  ) : publishing === 2 ? (
                    <HourglassTopIcon fontSize="small" />
                  ) : (
                    <HourglassBottomIcon fontSize="small" />
                  )
                }
                onClick={handlePublish}
                disabled={!draft || saving !== 0 || publishing !== 0 || !groups.includes('Editors')}
              >
                {publishing ? `Publishing ${publishingProgress}%` : 'Publish'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
      <div style={{ height: '100vh', maxWidth: '600px', margin: '0 auto', paddingBottom: 300 }}>
        {media ? (
          <div style={{ marginBottom: 40 }}>
            <ReactPlayer
              width="100%"
              ref={video}
              config={config}
              playing={playing}
              url={media.url}
              onProgress={onProgress}
              onBuffer={onBuffer}
              onBufferEnd={onBufferEnd}
              onPlay={play}
              onDuration={onDuration}
              progressInterval={100}
            />
            <div>
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item>
                  {buffering && seekTime !== time ? (
                    <IconButton onClick={pause} size="small">
                      {seekTime - time > 0 ? <FastForwardIcon /> : <FastRewindIcon />}
                    </IconButton>
                  ) : playing ? (
                    <IconButton onClick={pause} size="small">
                      <PauseIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={play} size="small">
                      <PlayArrowIcon />
                    </IconButton>
                  )}
                </Grid>
                <Grid container item xs>
                  <Slider
                    aria-label="timeline"
                    defaultValue={0}
                    max={duration}
                    min={0}
                    onChange={handleSliderChange}
                    size="small"
                    value={time}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>Loading media…</p>
        )}
        <div ref={div} style={{ height: `calc(100vh - ${top}px)`, overflow: 'scroll', paddingTop: 20 }}>
          {initialState ? (
            <Editor {...{ initialState, time, seekTo, speakers }} onChange={setDraft} />
          ) : (
            <p style={{ textAlign: 'center' }}>
              Loading transcript{' '}
              <span style={{ width: '3em', display: 'inline-block', textAlign: 'right' }}>{`${progress}%`}</span>
            </p>
          )}
        </div>
      </div>
    </Root>
  ) : null;
};

export default EditorPage;
