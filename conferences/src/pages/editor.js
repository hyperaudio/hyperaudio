import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection, Storage } from 'aws-amplify';
import { nanoid } from 'nanoid';
import ReactPlayer from 'react-player';

import { Editor, EditorState, convertFromRaw, createEntityMap } from '@hyperaudio/editor';

import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

import { Media, Channel, Transcript, Remix, RemixMedia } from '../models';
import { isArray } from 'lodash';

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
  }, [user]);

  const [time, setTime] = useState(0);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
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
    if (!transcript) return;

    (async () => {
      let { speakers, blocks } = await (await fetch(transcript.url)).json();

      // fix simple list of speakers (array -> map)
      if (isArray(speakers)) {
        speakers = speakers.reduce((acc, speaker) => {
          const id = `S${nanoid(5)}`;
          return { ...acc, [id]: { name: speaker, id } };
        }, {});

        blocks = blocks.map(block => ({
          ...block,
          key: `B${nanoid(5)}`,
          data: {
            ...block.data,
            start: block.data.items?.[0]?.start ?? 0,
            end: block.data.items?.[block.data.items.length - 1]?.end ?? 0,
            speaker: Object.entries(speakers).find(([id, { name }]) => name === block.data.speaker)?.[0],
            items: block.data.items.map((item, i, arr) => {
              const offset = arr.slice(0, i).reduce((acc, { text }) => acc + text.length + 1, 0);
              return { ...item, offset, length: item.text.length };
            }),
          },
          entityRanges: [],
          inlineStyleRanges: [],
        }));
      }

      setData({ speakers, blocks });
    })();
  }, [transcript]);

  const { speakers, blocks } = data ?? {};

  // console.log({ mediaId, transcriptId, media, transcripts, transcript, data });

  const initialState = useMemo(
    () =>
      blocks && EditorState.createWithContent(convertFromRaw({ blocks: blocks, entityMap: createEntityMap(blocks) })),
    [data],
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

  const handleSave = useCallback(async () => {
    const result = await Storage.put('test.txt', 'Test Content', {
      level: 'public',
      contentType: 'text/plain',
    });

    console.log(result);

    const signedURL = await Storage.get('test.txt', { level: 'public' });
    console.log(signedURL);
  }, []);

  const div = useRef();
  const top = useMemo(() => div.current?.getBoundingClientRect().top ?? 500, [div]);

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
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
          'Loading…'
        )}
        <div ref={div} style={{ height: `calc(100vh - ${top}px)`, overflow: 'scroll', paddingTop: 20 }}>
          {initialState && <Editor {...{ initialState, time, seekTo, speakers }} />}
        </div>
      </div>
    </Root>
  );
};

export default EditorPage;
