import * as cldrSegmentation from 'cldr-segmentation';
import Head from 'next/head';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import React, { useMemo, useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { DataStore, loadingSceneName, Predicates, SortDirection, Storage } from 'aws-amplify';
import { createSilentAudio } from 'create-silent-audio';
import { isArray } from 'lodash';
import { nanoid } from 'nanoid';
import { usePlausible } from 'next-plausible';
import { useRouter } from 'next/router';
import mux from 'mux-embed';
import TC from 'smpte-timecode';
import bs58 from 'bs58';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PreviewIcon from '@mui/icons-material/Preview';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import Skeleton from '@mui/material/Skeleton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Editor, EditorState, convertFromRaw, createEntityMap } from '@hyperaudio/editor';

import { Media, Channel, Transcript, Remix, RemixMedia } from '../models';

// function CircularProgressWithLabel(props) {
//   return (
//     <Box sx={{ position: 'relative', display: 'inline-flex' }}>
//       <CircularProgress variant="determinate" {...props} />
//       <Box
//         sx={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//           position: 'absolute',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }

function SkeletonLoader({ progress }) {
  const dummytextarr = [...Array(5).keys()];
  return (
    <>
      {[...Array(5).keys()].map(key1 => (
        <>
          <Grid container spacing={1} key={key1}>
            <Grid item xs={2}>
              <Skeleton variation="text" sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={10}>
              <Skeleton variation="text" sx={{ width: '100%' }} />
            </Grid>
          </Grid>
          {dummytextarr.map((key2, i) => (
            <Grid container spacing={1} key={key2}>
              <Grid item xs={2}></Grid>
              <Grid item xs={10}>
                <Skeleton variation="text" sx={{ width: i === dummytextarr.length - 1 ? '66%' : '100%' }} />
              </Grid>
            </Grid>
          ))}
        </>
      ))}
      {/* <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.5)',
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <CircularProgressWithLabel color="primary" size={64} thickness={2} value={progress} variant="determinate" />
      </Box> */}
    </>
  );
}

const PREFIX = 'EditorPage';
const classes = {
  root: `${PREFIX}-root`,
  paneTitle: `${PREFIX}-paneTitle`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  width: '100%',
  [`& .${classes.paneTitle}`]: {
    background: theme.palette.divider,
    color: theme.palette.primary.main,
    fontSize: '10px',
    fontWeight: '500',
    padding: theme.spacing(0, 0.5),
    position: 'absolute',
    top: 0,
    transition: `opacity ${theme.transitions.duration.standard}ms`,
    zIndex: 1,
  },
}));

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, m => m.id('eq', id));
  setMedia(media?.[0]);
};

const getTranscripts = async (setTranscripts, id) =>
  setTranscripts((await DataStore.query(Transcript)).filter(t => t.media === id));

const EditorPage = ({ organisation, user, groups }) => {
  const plausible = usePlausible();
  const router = useRouter();
  const {
    query: { media: mediaId, transcript: transcriptId, original: originalId, noKaraoke = false },
  } = router;

  useEffect(() => {
    if (user === null) {
      router.push(
        `/auth?redirect=${encodeURIComponent(
          `/editor?media=${mediaId}${originalId ? `&original=${originalId}` : ''}&transcript=${transcriptId}`,
        )}`,
      );
    }
  }, [user, mediaId, transcriptId, originalId, router]);

  const [time, setTime] = useState(0);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [originalProgress, setOriginalProgress] = useState(0);
  const [data, setData] = useState();
  const [originalData, setOriginalData] = useState();
  const [error, setError] = useState();

  const transcript = useMemo(() => transcripts.filter(t => t.id === transcriptId)?.[0], [transcriptId, transcripts]);
  const original = useMemo(() => transcripts.filter(t => t.id === originalId)?.[0], [originalId, transcripts]);

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
    console.log('LOADING', { media, transcript });

    (async () => {
      let speakers;
      let blocks;

      try {
        const signedURL = await Storage.get(
          `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
          {
            level: 'public',
          },
        );

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
        // setError(error);

        // FIXME use transcript original url
        // use transcript's url
        try {
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
                // speaker: Object.entries(speakers).find(([id, { name }]) => name === block.data.speaker)?.[0],
                speaker: block.data.speaker,
                items,
                stt: items,
              },
              entityRanges: [],
              inlineStyleRanges: [],
            };
          });
        } catch (error) {
          setError(error);
        }
      }

      console.log({ speakers, blocks });
      setData({ speakers, blocks });
    })();
  }, [media, transcript]);

  useEffect(() => {
    if (!original || !media) return;
    console.log('LOADING original', { media, original });

    (async () => {
      let speakers;
      let blocks;

      try {
        const signedURL = await Storage.get(`transcript/${media.playbackId}/${original.language}/${original.id}.json`, {
          level: 'public',
        });

        const result = (
          await axios.get(signedURL, {
            onDownloadProgress: progressEvent => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setOriginalProgress(percentCompleted === Infinity ? 100 : percentCompleted);
            },
          })
        ).data;

        speakers = result.speakers;
        blocks = result.blocks;

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
              // speaker: Object.entries(speakers).find(([id, { name }]) => name === block.data.speaker)?.[0],
              speaker: block.data.speaker,
              items,
              stt: items,
            },
            entityRanges: [],
            inlineStyleRanges: [],
          };
        });
      } catch (error) {
        // setError(error);

        // FIXME use transcript original url
        // use transcript's url
        try {
          const result = (
            await axios.get(original.url, {
              onDownloadProgress: progressEvent => {
                // console.log(progressEvent);
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setOriginalProgress(
                  progressEvent.lengthComputable ? (percentCompleted === Infinity ? 100 : percentCompleted) : 75,
                );
              },
            })
          ).data;

          speakers = result.speakers;
          blocks = result.blocks;
        } catch (error) {
          setError(error);
        }
      }

      console.log('original', { speakers, blocks });
      setOriginalData({ speakers, blocks });
    })();
  }, [media, original]);

  const { speakers, blocks } = data ?? {};

  // console.log({ user, groups, mediaId, transcriptId, media, transcripts, transcript, data });

  const initialState = useMemo(
    () =>
      blocks && EditorState.createWithContent(convertFromRaw({ blocks: blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  useEffect(() => setSaved({ contentState: initialState?.getCurrentContent() }), [initialState]);

  const originalState = useMemo(
    () =>
      originalData?.blocks &&
      EditorState.createWithContent(
        convertFromRaw({ blocks: originalData.blocks, entityMap: createEntityMap(originalData.blocks) }),
      ),
    [originalData],
  );

  useEffect(() => console.log({ initialState }), [initialState]);
  useEffect(() => console.log({ originalState }), [originalState]);

  const video = useRef();

  const waitForPlayer = useCallback(() => {
    console.log('waitForPlayer');
    if (!media) return;

    console.log('MUX?');
    if (video.current?.getInternalPlayer('hls') && global.MUX_KEY) {
      console.log('MUX ON');
      const initTime = Date.now();
      mux.monitor(video.current.getInternalPlayer(), {
        debug: false,
        hlsjs: video.current?.getInternalPlayer('hls'),
        data: {
          env_key: global.MUX_KEY,
          player_name: 'Editor',
          player_init_time: initTime,
          video_id: media.playbackId,
          video_title: media.title,
        },
      });
    } else if (global.MUX_KEY) {
      setTimeout(() => waitForPlayer(), (1e3 * 1) / 60); // TODO use reqAnimFrame?
    }
  }, [video, media]);

  useEffect(() => waitForPlayer(), [waitForPlayer]);

  const seekTo = useCallback(
    time => {
      setSeekTime(time);
      if (video.current) video.current.seekTo(time, 'seconds');
    },
    [video],
  );

  const [tempAutoScroll, setTempAutoScroll] = useState(false);
  const originalSeekTo = useCallback(
    time => {
      setSeekTime(time);
      if (video.current) video.current.seekTo(time, 'seconds');
      setTempAutoScroll(true);
      setTimeout(() => setTempAutoScroll(false), 2000);
    },
    [video],
  );

  const config = useMemo(
    () => ({
      file: {
        attributes: {
          poster: media?.poster,
        },
        // hlsOptions: {
        //   backBufferLength: 30,
        //   maxMaxBufferLength: 30,
        // },
      },
    }),
    [media],
  );

  const [seekTime, setSeekTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [pip, setPip] = useState(false);

  const onProgress = useCallback(({ playedSeconds }) => {
    setTime(playedSeconds);
  }, []);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);

  const handleSliderChange = useCallback(
    (event, value) => {
      setSeekTime(value);
      if (video.current) video.current.seekTo(value, 'seconds');
    },
    [video],
  );

  const onEnablePIP = useCallback(() => setPip(true), []);
  const onDisablePIP = useCallback(() => setPip(false), []);
  const onBuffer = useCallback(() => setBuffering(true), []);
  const onBufferEnd = useCallback(() => setBuffering(false), []);
  const onDuration = useCallback(duration => setDuration(duration), []);

  const [draft, setDraft] = useState();
  const [saved, setSaved] = useState();
  const [saving, setSaving] = useState(0);
  const [previewing, setPreviewing] = useState(0);
  const [savingProgress, setSavingProgress] = useState(0);
  const [previewingProgress, setPreviewingProgress] = useState(0);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishing, setPublishing] = useState(0);

  // useEffect(() => {
  //   console.log('onbeforeunload');
  //   window.onbeforeunload = e => {
  //     if (draft && draft.contentState !== saved?.contentState) {
  //       e.preventDefault();
  //       e.returnValue = '';
  //     } else {
  //       delete e['returnValue'];
  //     }
  //   };
  // }, []);

  global.listUnusedSpeakers = useCallback(() => {
    const data = { speakers: draft.speakers, blocks: draft.blocks };

    const allSpeakerIds = [...new Set(Object.keys(data.speakers))];
    const usedSpeakerIds = [...new Set(data.blocks.map(({ data: { speaker } }) => speaker))];
    const unusedSpeakerIds = allSpeakerIds.filter(id => !usedSpeakerIds.includes(id));
    console.log({
      allSpeakerIds,
      usedSpeakerIds,
      unusedSpeakerIds,
      names: unusedSpeakerIds.map(id => data.speakers[id].name),
    });

    const speakers = {};
    const blocks = data.blocks.map(block => {
      const speakerName = data.speakers[block.data.speaker].name.trim();
      const speakerId = 'S' + bs58.encode(Buffer.from(speakerName));

      speakers[speakerId] = { name: speakerName };

      return { ...block, data: { ...block.data, speaker: speakerId } };
    });

    console.log({ speakers, blocks });
    // setDraft({ speakers, blocks });
  }, [draft]);

  const handleSave = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setSavingProgress(0);
    setSaving(2); // 3

    const data = { speakers: draft.speakers, blocks: draft.blocks };

    const allSpeakerIds = [...new Set(Object.keys(data.speakers))];
    const usedSpeakerIds = [...new Set(data.blocks.map(({ data: { speaker } }) => speaker))];
    const unusedSpeakerIds = allSpeakerIds.filter(id => !usedSpeakerIds.includes(id));
    unusedSpeakerIds.forEach(id => delete data.speakers[id]);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
      JSON.stringify(data),
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
    setSaving(1);

    // touch transcript
    await DataStore.save(
      Transcript.copyOf(transcript, updated => {
        updated.metadata = { ...(transcript.metadata ?? {}), lastEdit: new Date() };
      }),
    );

    setTimeout(() => setSaving(0), 500);
    plausible('save');
    setSaved(draft);
  }, [draft, media, transcript, user, plausible]);

  const handlePreview = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setPreviewingProgress(0);
    setPreviewing(2);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-preview.json`,
      JSON.stringify({ speakers: draft.speakers, blocks: draft.blocks }),
      {
        level: 'public',
        contentType: 'application/json',
        metadata: {
          user: user.id,
        },
        progressCallback(progress) {
          // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
          setPreviewingProgress(percentCompleted);
        },
      },
    );

    console.log(result);
    setPreviewing(1);
    setTimeout(() => setPreviewing(0), 500);

    window.open(`/media/${media.id}?showPreview=true`, '_blank');
    plausible('preview');
  }, [draft, media, transcript, user, plausible]);

  const handlePublish = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setPublishingProgress(0);
    setPublishing(3);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json`,
      JSON.stringify({ speakers: draft.speakers, blocks: draft.blocks }),
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
      JSON.stringify({ speakers: draft.speakers, blocks: draft.blocks }),
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
        updated.url = `https://mozfest.hyper.audio/public/transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json`;
        updated.metadata = { original: transcript.url, ...(transcript.metadata ?? {}) };
      }),
    );

    await DataStore.save(
      Media.copyOf(media, updated => {
        updated.status = { label: 'published' };
      }),
    );

    setPublishing(1);
    setTimeout(() => setPublishing(0), 500);

    // const signedURL = await Storage.get(
    //   `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json`,
    //   {
    //     level: 'public',
    //   },
    // );
    // console.log(signedURL);
    plausible('publish');
    setSaved(draft);
  }, [draft, media, transcript, user, plausible]);

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
        updated.url =
          transcript.metadata?.original ??
          `https://stream.hyper.audio/q3xsh/transcript/${media.playbackId}/transcript.json`;
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

  global.newTranslation = useCallback(
    async (language = 'it-IT') => {
      const suppressions = cldrSegmentation.suppressions.all;

      const blocks = draft.blocks.map(block => {
        const sentences = cldrSegmentation.sentenceSplit(block.text, suppressions).map((sentence, i, arr) => {
          const offset = arr.slice(0, i).reduce((acc, s) => acc + s.length, 0);
          const length = sentence.trim().length;
          const startItem = block.data.items.find(item => item.offset === offset);
          const endItem = block.data.items.find(item => item.offset === offset + length - item.length);

          return {
            offset,
            length,
            // startItem,
            // endItem,
            start: startItem?.start,
            end: endItem?.end,
            text: sentence.trim(),
            // text_: block.text.substring(offset, offset + length),
          };
        });
        return { ...block, data: { ...block.data, sentences } };
      });

      // console.log(blocks);

      const MAX_CHUNK_LENGTH = 4.5 * 1e3;

      const chunks = blocks
        .map((block, i) => {
          const text = `§§${i}§\n\n` + block.data.sentences.map(sentence => sentence.text).join('\n\n');
          return {
            // key: block.key,
            text,
            length: text.length,
          };
        })
        .reduce((acc, chunk, i, arr) => {
          if (i === 0) return [chunk];

          const prev = acc.pop();
          if (prev.length + chunk.length < MAX_CHUNK_LENGTH) {
            prev.text = prev.text + '\n\n' + chunk.text;
            prev.length = prev.text.length;
            return [...acc, prev];
          }

          return [...acc, prev, chunk];
        }, []);

      console.log(chunks.length, chunks);

      const translatedChunks = await Promise.all(
        chunks.map(({ text }) =>
          Predictions.convert({
            translateText: {
              source: {
                text,
                language: transcript.language,
              },
              targetLanguage: language,
            },
          }),
        ),
      );

      console.log(translatedChunks);

      const translatedBlocks = translatedChunks
        .map(({ text }) => text)
        .join('\n\n')
        .split('\n\n§§')
        .map((line, i) => {
          const sentences = line.split('\n\n').slice(1);
          // if (!line.startsWith(`${i}§`)) console.log(`${i}§`, line); // sometimes 299 translates to 29!
          const block = blocks[i];

          const newBlock = {
            ...block,
            key: `t${nanoid(5)}`,
            data: {
              ...block.data,
              // block,
              sentences: sentences.map((sentence, j) => {
                return {
                  start: block.data.sentences[j].start,
                  end: block.data.sentences[j].end,
                  text: sentence,
                  // original: block.data.sentences[j],
                };
              }),
            },
          };

          newBlock.text = newBlock.data.sentences.map(({ text }) => text).join(' ');
          newBlock.data.items = newBlock.data.sentences
            .flatMap(({ text, start, end }) => text.split(' ').map(text => ({ text, start, end, length: text.length })))
            .map((item, j, arr) => ({
              ...item,
              offset: arr.slice(0, j).reduce((acc, item) => acc + item.length + 1, 0),
            }));
          return newBlock;
        });

      console.log(translatedBlocks);

      const result = await Storage.put(
        `transcript/${media.playbackId}/it-IT/c1751895-c49a-46f4-85be-8d9127e3da25.json`,
        JSON.stringify({ speakers: draft.speakers, blocks: translatedBlocks }),
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
    },
    [media, transcripts, transcript, draft, user],
  );

  const div = useRef();
  const [top, setTop] = useState(500);

  useLayoutEffect(() => {
    // console.log('useLayoutEffect');
    const value = div.current?.getBoundingClientRect().top ?? 500;
    console.log(div.current?.getBoundingClientRect(), value, pip);
    setTop(value);
  }, [div, pip]);

  return user ? (
    <>
      <Head>
        <title>
          Edit: {media?.title ? `“${media.title}”` : 'Untitled'} • {organisation.name} @ hyper.audio
        </title>
      </Head>
      <Root className={classes.root}>
        <Toolbar />
        <Toolbar sx={{ width: '100%' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <Stack direction="row" spacing={1}>
                <LoadingButton
                  color="primary"
                  disabled={
                    !draft || saving !== 0 || !groups.includes('Editors') || draft.contentState === saved?.contentState
                  }
                  loading={saving !== 0}
                  loadingPosition="start"
                  onClick={handleSave}
                  startIcon={<SaveIcon fontSize="small" />}
                >
                  Save
                  <Box
                    component="span"
                    variant="button"
                    sx={{ display: { xs: 'none', md: 'inline-block' }, ml: '0.44em' }}
                  >
                    draft
                  </Box>
                </LoadingButton>
                <LoadingButton
                  color="primary"
                  disabled={!draft || previewing !== 0 || !groups.includes('Editors')}
                  loading={previewing > 0}
                  loadingPosition="start"
                  onClick={handlePreview}
                  startIcon={<PreviewIcon fontSize="small" />}
                >
                  Preview
                  <Box
                    component="span"
                    variant="button"
                    sx={{ display: { xs: 'none', md: 'inline-block' }, ml: '0.44em' }}
                  >
                    draft
                  </Box>
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item>
              <LoadingButton
                color="primary"
                disabled={!draft || saving !== 0 || publishing !== 0 || previewing !== 0 || !groups.includes('Editors')}
                endIcon={<PublishIcon fontSize="small" />}
                loading={publishing !== 0}
                loadingPosition="end"
                onClick={handlePublish}
              >
                Publish
              </LoadingButton>
            </Grid>
          </Grid>
        </Toolbar>

        {/* THEATRE
        ------------------------------------
        */}
        <Container maxWidth={originalId ? 'xl' : 'sm'} sx={{ pb: 2 }}>
          {media ? (
            <Box>
              <Box
                sx={{
                  bgcolor: 'black',
                  borderRadius: 1,
                  display: pip ? 'none' : 'block',
                  overflow: 'hidden',
                }}
              >
                <ReactPlayer
                  config={config}
                  onBuffer={onBuffer}
                  onBufferEnd={onBufferEnd}
                  onDisablePIP={onDisablePIP}
                  onDuration={onDuration}
                  onEnablePIP={onEnablePIP}
                  onPlay={play}
                  onProgress={onProgress}
                  playing={playing}
                  progressInterval={100}
                  ref={video}
                  url={media.url}
                  width="100%"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
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
                      valueLabelFormat={timecode}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="360px"
                sx={{ lineHeight: 0, mb: 2, borderRadius: { xs: 0, xl: 1 } }}
              />
              <Skeleton variant="rectangular" width="100%" height="20px" sx={{ borderRadius: 1 }} />
            </Box>
          )}
        </Container>
        <Divider sx={{ width: '100%' }} />
        {/* TRANSCRIPT
        ------------------------------------
        */}
        {originalId ? (
          <Container disableGutters maxWidth="xl" ref={div} sx={{ flexGrow: 1, px: { xs: 0, lg: 3 } }}>
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={6} sx={{ position: 'relative', '&:hover .PaneTitle': { opacity: 0 } }}>
                <Typography
                  className={`${classes.paneTitle} PaneTitle`}
                  component="h2"
                  sx={{ left: 0 }}
                  variant="overline"
                >
                  Original
                </Typography>
                <Box
                  ref={div}
                  sx={{
                    borderColor: 'divider',
                    borderStyle: 'solid',
                    borderWidth: { xs: '0 0 0 1px' },
                    bottom: 0,
                    left: 0,
                    overflow: originalState ? 'auto' : 'hidden',
                    pb: 12,
                    position: 'absolute',
                    pt: 2,
                    right: 0,
                    top: 0,
                    width: '100%',
                    ['& .public-DraftStyleDefault-block span']: {
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Container maxWidth="sm">
                    {originalState ? (
                      <Editor
                        time={time}
                        speakers={originalData.speakers}
                        initialState={originalState}
                        onChange={NOOP}
                        readOnly={true}
                        autoScroll={true}
                        seekTo={originalSeekTo}
                        playheadDecorator={null}
                        play={play}
                        playing={playing}
                        pause={pause}
                      />
                    ) : error ? (
                      <Typography color="error" variant="body2">
                        Error: {error?.message}
                      </Typography>
                    ) : (
                      <SkeletonLoader progress={originalProgress} />
                    )}
                  </Container>
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ position: 'relative', '&:hover .PaneTitle': { opacity: 0 } }}>
                <Typography
                  className={`${classes.paneTitle} PaneTitle`}
                  component="h2"
                  sx={{ right: 0 }}
                  variant="overline"
                >
                  Translation
                </Typography>
                <Box
                  ref={div}
                  sx={{
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    borderStyle: 'solid',
                    borderWidth: { xs: '0 0 0 1px', lg: '0 1px' },
                    bottom: 0,
                    left: 0,
                    overflow: initialState ? 'auto' : 'hidden',
                    pb: 12,
                    position: 'absolute',
                    pt: 2,
                    right: 0,
                    top: 0,
                    width: '100%',
                  }}
                >
                  <Container maxWidth="sm">
                    {initialState ? (
                      <Editor
                        time={time}
                        speakers={speakers}
                        initialState={initialState}
                        onChange={setDraft}
                        // autoScroll={tempAutoScroll}
                        autoScroll={true}
                        seekTo={seekTo}
                        playheadDecorator={null}
                        play={play}
                        playing={playing}
                        pause={pause}
                      />
                    ) : error ? (
                      <Typography color="error" variant="body2">
                        Error: {error?.message}
                      </Typography>
                    ) : (
                      <SkeletonLoader progress={progress} />
                    )}
                  </Container>
                </Box>
              </Grid>
            </Grid>
          </Container>
        ) : (
          <Box
            ref={div}
            sx={{
              overflow: initialState ? 'auto' : 'hidden',
              position: 'relative',
              pb: 12,
              pt: 2,
              width: '100%',
            }}
          >
            <Container maxWidth="sm">
              {initialState ? (
                <Editor
                  {...{ initialState, time, seekTo, speakers, playing, play, pause }}
                  autoScroll={true}
                  onChange={setDraft}
                  playheadDecorator={noKaraoke ? null : undefined}
                />
              ) : error ? (
                <Typography color="error" variant="body2">
                  Error: {error?.message}
                </Typography>
              ) : (
                <SkeletonLoader progress={progress} />
              )}
            </Container>
          </Box>
        )}
      </Root>
    </>
  ) : null;
};

const NOOP = () => {};

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * 25, 25, false)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

export default EditorPage;
