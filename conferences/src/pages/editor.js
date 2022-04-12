import * as cldrSegmentation from 'cldr-segmentation';
import Head from 'next/head';
import ISO6391 from 'iso-639-1';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import Queue from 'queue-promise';
import React, { useMemo, useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import ReactPlayer from 'react-player';
import TC from 'smpte-timecode';
import axios from 'axios';
import bs58 from 'bs58';
import mux from 'mux-embed';
import pako from 'pako';
import useInterval from 'use-interval';
import { DataStore, loadingSceneName, Predicates, SortDirection, Storage } from 'aws-amplify';
import { nanoid } from 'nanoid';
import { usePlausible } from 'next-plausible';
import { useRouter } from 'next/router';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublishIcon from '@mui/icons-material/Publish';
import SaveIcon from '@mui/icons-material/Save';
import Skeleton from '@mui/material/Skeleton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';

import { Editor, EditorState, convertFromRaw, createEntityMap } from '@hyperaudio/editor';

import Link from '../components/MuiNextLink';
import MonetizationDialog from '../components/editor/MonetizationDialog';
import NewTranslation from '../components/editor/NewTranslation';
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
  paneTitle: `${PREFIX}-paneTitle`,
  root: `${PREFIX}-root`,
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
    color: theme.palette.text.primary,
    fontSize: '10px',
    fontWeight: '500',
    padding: theme.spacing(0, 0.5),
    position: 'absolute',
    top: 0,
    transition: `opacity ${theme.transitions.duration.standard}ms`,
    zIndex: 1,
  },
}));

const queue = new Queue({
  concurrent: 1,
  interval: 10 * 1e3,
});

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

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [langDialog, setLangDialog] = useState(false);
  const [media, setMedia] = useState();
  const [monetizationDialog, setMonetizationDialog] = useState(false);
  const [originalData, setOriginalData] = useState();
  const [originalProgress, setOriginalProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [transcripts, setTranscripts] = useState([]);

  const transcript = useMemo(() => transcripts.filter(t => t.id === transcriptId)?.[0], [transcriptId, transcripts]);
  const original = useMemo(() => transcripts.filter(t => t.id === originalId)?.[0], [originalId, transcripts]);

  useEffect(() => {
    if (originalId || !media || !transcripts || !transcript) return;

    const original = transcripts.find(t => t.language === media.language);
    if (original.id !== transcriptId)
      router.push(`/editor?media=${mediaId}&original=${original.id}&transcript=${transcriptId}`);
  }, [media, transcript, mediaId, transcriptId, originalId, transcripts, router]);

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
          `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json.gz`,
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
        const signedURL = await Storage.get(
          `transcript/${media.playbackId}/${original.language}/${original.id}.json.gz`,
          {
            level: 'public',
          },
        );

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

  // const { speakers, blocks } = data ?? {};
  // const { speakers, blocks } = useMemo(() => {
  //   if (!data) return {};

  //   return {
  //     blocks: data.blocks,
  //     speakers: Object.entries(data.speakers).reduce((acc, [id, entry]) => {
  //       let name = entry.name;
  //       if (name.startsWith('spk_')) {
  //         entry.spk = name;
  //         const number = parseInt(name.split('_').pop()) + 1;
  //         name = `Speaker ${number}`;
  //       }

  //       return { ...acc, [id]: { ...entry, name, id } };
  //     }, {}),
  //   };
  // }, [data]);

  const [speakers, setSpeakers] = useState({});
  const { blocks } = data ?? {};

  useEffect(() => {
    if (!data) return;

    setSpeakers(
      Object.entries(data.speakers).reduce((acc, [id, entry]) => {
        let name = entry.name;
        if (name.startsWith('spk_')) {
          entry.spk = name;
          const number = parseInt(name.split('_').pop()) + 1;
          name = `Unknown ${number}`;
        }

        return { ...acc, [id]: { ...entry, name, id } };
      }, {}),
    );
  }, [data]);

  // const [speakers, setSpeakers] = useState(
  //   Object.entries(initialSpeakers).reduce((acc, [id, speaker]) => {
  //     return { ...acc, [id]: { ...speaker, id } };
  //   }, {}),
  // );

  // console.log({ speakers });
  // console.log({ user, groups, mediaId, transcriptId, media, transcripts, transcript, data });

  useEffect(() => console.log({ speakers }), [speakers]);

  const initialState = useMemo(
    () =>
      blocks && EditorState.createWithContent(convertFromRaw({ blocks: blocks, entityMap: createEntityMap(blocks) })),
    [blocks],
  );

  useEffect(() => {
    setSaved({ contentState: initialState?.getCurrentContent() });
    setAutoSaved({ contentState: initialState?.getCurrentContent() });
  }, [initialState]);

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
  const [autoSaved, setAutoSaved] = useState();
  const [saving, setSaving] = useState(0);
  const [previewing, setPreviewing] = useState(0);
  const [savingProgress, setSavingProgress] = useState(0);
  const [previewingProgress, setPreviewingProgress] = useState(0);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishing, setPublishing] = useState(0);

  const handleBeforeUnload = useCallback(
    e => {
      if (draft && draft.contentState !== saved?.contentState) {
        e.preventDefault();
        e.returnValue = '';
      } else {
        delete e['returnValue'];
      }
    },
    [draft, saved],
  );

  useEffect(() => {
    const beforeUnloadListener = window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnloadListener);
  }, [handleBeforeUnload]);

  const onSubmitMonetization = useCallback(
    monetization => {
      console.log(monetization);
      setSpeakers(
        Object.entries(speakers).reduce(
          (acc, [id, entry]) => ({ ...acc, [id]: { ...entry, monetization: monetization[id] } }),
          {},
        ),
      );
      setSaved({});
      setMonetizationDialog(false);
    },
    [speakers],
  );

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

    const data = { speakers, blocks: draft.blocks };

    const allSpeakerIds = [...new Set(Object.keys(data.speakers))];
    const usedSpeakerIds = [...new Set(data.blocks.map(({ data: { speaker } }) => speaker))];
    const unusedSpeakerIds = allSpeakerIds.filter(id => !usedSpeakerIds.includes(id));
    unusedSpeakerIds.forEach(id => delete data.speakers[id]);

    const utf8Data = new TextEncoder('utf-8').encode(JSON.stringify(data));
    const jsonGz = pako.gzip(utf8Data);
    const blobGz = new Blob([jsonGz]);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json.gz`,
      // JSON.stringify(data),
      blobGz,
      {
        level: 'public',
        contentType: 'application/json',
        contentEncoding: 'gzip',
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
  }, [draft, media, speakers, transcript, user, plausible]);

  global.autoSave = useCallback(async () => {
    if (!draft || !media || !transcript || autoSaved.contentState === draft.contentState) return;
    console.log('autoSaving!');
    const data = { speakers, blocks: draft.blocks };

    const allSpeakerIds = [...new Set(Object.keys(data.speakers))];
    const usedSpeakerIds = [...new Set(data.blocks.map(({ data: { speaker } }) => speaker))];
    const unusedSpeakerIds = allSpeakerIds.filter(id => !usedSpeakerIds.includes(id));
    unusedSpeakerIds.forEach(id => delete data.speakers[id]);

    // https://stackoverflow.com/questions/57225380/browser-javascript-compress-json-to-gzip-and-upload-to-s3-presigned-url
    // const str = JSON.stringify(data);
    // const utf8Data = unescape(encodeURIComponent(str));
    const utf8Data = new TextEncoder('utf-8').encode(JSON.stringify(data));
    const jsonGz = pako.gzip(utf8Data);
    const blobGz = new Blob([jsonGz]);

    const result = await Storage.put(
      // `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-autosave.json`,
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-autosave.json.gz`,
      // JSON.stringify(data),
      blobGz,
      {
        level: 'public',
        contentType: 'application/json',
        contentEncoding: 'gzip',
        metadata: {
          user: user.id,
        },
      },
    );

    setAutoSaved(draft);
  }, [draft, media, speakers, transcript, user, autoSaved]);

  useInterval(() => {
    console.log('autoSave?');
    autoSave();
  }, 60 * 1e3);

  const handlePreview = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setPreviewingProgress(0);
    setPreviewing(2);

    const data = { speakers, blocks: draft.blocks };
    const utf8Data = new TextEncoder('utf-8').encode(JSON.stringify(data));
    const jsonGz = pako.gzip(utf8Data);
    const blobGz = new Blob([jsonGz]);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-preview.json.gz`,
      // JSON.stringify(data),
      blobGz,
      {
        level: 'public',
        contentType: 'application/json',
        contentEncoding: 'gzip',
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

    window.open(`/media/${media.id}?language=${transcript.language}&showPreview=true`, '_blank');
    plausible('preview');
  }, [draft, media, speakers, transcript, user, plausible]);

  const handlePublish = useCallback(async () => {
    if (!draft || !media || !transcript) return;
    console.log(draft);
    setPublishingProgress(0);
    setPublishing(3);

    const data = { speakers, blocks: draft.blocks };
    const utf8Data = new TextEncoder('utf-8').encode(JSON.stringify(data));
    const jsonGz = pako.gzip(utf8Data);
    const blobGz = new Blob([jsonGz]);

    const result = await Storage.put(
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}.json.gz`,
      // JSON.stringify({ speakers: draft.speakers, blocks: draft.blocks }),
      blobGz,
      {
        level: 'public',
        contentType: 'application/json',
        contentEncoding: 'gzip',
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
      `transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json.gz`,
      // JSON.stringify({ speakers: draft.speakers, blocks: draft.blocks }),
      blobGz,
      {
        level: 'public',
        contentType: 'application/json',
        contentEncoding: 'gzip',
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
        updated.url = `https://mozfest.hyper.audio/public/transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json.gz`;
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

    plausible('publish');
    setSaved(draft);
  }, [draft, media, speakers, transcript, user, plausible]);

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

    await Storage.remove(`transcript/${media.playbackId}/${transcript.language}/${transcript.id}-published.json.gz`, {
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

      // const translatedChunks = await Promise.all(
      //   chunks.map(({ text }) =>
      //     Predictions.convert({
      //       translateText: {
      //         source: {
      //           text,
      //           language: transcript.language,
      //         },
      //         targetLanguage: language,
      //       },
      //     }),
      //   ),
      // );

      const title = await Predictions.convert({
        translateText: {
          source: {
            text: transcript.title,
            language: transcript.language,
          },
          targetLanguage: language,
        },
      });

      const results = [];
      chunks.forEach(async ({ text }, index) => {
        queue.enqueue(async () => {
          const result = await Predictions.convert({
            translateText: {
              source: {
                text,
                language: transcript.language,
              },
              targetLanguage: language,
            },
          });

          results.push({ index, result });
          return { index, result };
        });
      });

      queue.on('end', async () => {
        console.log('DONE');

        const translatedChunks = results.sort((a, b) => a.index - b.index).map(({ result }) => result);

        console.log({ translatedChunks });

        const translatedBlocks = translatedChunks
          .map(({ text }) => text)
          .join('\n\n')
          .split('\n\n§') // was §§
          .map((line, i) => {
            const sentences = line.split('\n\n').slice(1);
            // if (!line.startsWith(`${i}§`)) console.log(`${i}§`, line); // sometimes 299 translates to 29!
            const block = blocks[i];
            console.log(i, { sentences, block });

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
              .flatMap(({ text, start, end }) =>
                text.split(' ').map(text => ({ text, start, end, length: text.length })),
              )
              .map((item, j, arr) => ({
                ...item,
                offset: arr.slice(0, j).reduce((acc, item) => acc + item.length + 1, 0),
              }));
            return newBlock;
          });

        console.log(translatedBlocks);

        const description = await Predictions.convert({
          translateText: {
            source: {
              text: transcript.description,
              language: transcript.language,
            },
            targetLanguage: language,
          },
        });

        console.log({ title, description });

        // const transcript2 = await DataStore.save(
        //   new Transcript({
        //     title: title.text,
        //     description: description.text,
        //     language: language,
        //     url: transcript.url,
        //     media: media.id,
        //     status: { label: 'translating' },
        //   }),
        // );

        // await DataStore.save(
        //   Transcript.copyOf(transcript2, updated => {
        //     updated.status = { label: 'translated' };
        //     updated.url = `https://mozfest.hyper.audio/public/transcript/${media.playbackId}/${language}/${transcript2.id}.json`;
        //   }),
        // );

        // console.log(transcript2);

        const result = await Storage.put(
          // `transcript/${media.playbackId}/${language}/${transcript2.id}.json`,
          `transcript/${media.playbackId}/${language}/test.json`,

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
        //
      });

      queue.on('dequeue', () => console.log('dequeue'));
      queue.on('resolve', data => {
        console.log('resolve', data);
      });
      queue.on('reject', error => console.log('error', error));
      queue.on('start', () => console.log('start'));
      queue.on('stop', () => console.log('stop'));

      queue.start();
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

  const onNewTranslation = () => {
    setLangDialog(true);
    setLangAnchorEl(null);
  };

  const [translationProgress, setTranslationProgress] = useState(0);
  const createTranslation = useCallback(lang => {
    console.log(lang);
    setTranslationProgress(10);
    setTimeout(() => setTranslationProgress(50), 5000);
    setTimeout(() => setTranslationProgress(100), 10000);
  }, []);

  // temporary
  const showTranslate = useMemo(() => global.location && global.location.hostname === 'localhost', []);

  return user ? (
    <>
      <Head>
        <title>
          Edit: {media?.title ? `“${media.title}”` : 'Untitled'} • {organisation.name} @ hyper.audio
        </title>
      </Head>
      <Root className={classes.root}>
        <Toolbar />
        {/* THEATRE
        ------------------------------------
        */}
        <Box
          sx={{
            bgcolor: 'black',
            color: 'white',
            width: '100%',
            '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
          }}
        >
          <Toolbar>
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <Button
                color="inherit"
                endIcon={<ArrowDropDownIcon />}
                id="translations-button"
                size="small"
                variant="outlined"
                onClick={e => setLangAnchorEl(e.currentTarget)}
              >
                {ISO6391.getName(transcript?.language.split('-')[0])}
              </Button>
              <Button
                color="inherit"
                component={Link}
                href={{ pathname: `/media/${media?.id}`, query: { language: transcript?.language } }}
                size="small"
                startIcon={<ArrowBackIcon />}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                Back
              </Button>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  alignSelf: 'center',
                  borderColor: 'rgba(255,255,255,0.22)',
                  display: { xs: 'none', md: 'unset' },
                  height: '16px',
                }}
              />
              <LoadingButton
                color="inherit"
                disabled={
                  !draft || saving !== 0 || !groups.includes('Editors') || draft.contentState === saved?.contentState
                }
                loading={saving !== 0}
                loadingPosition="start"
                onClick={handleSave}
                startIcon={<SaveIcon fontSize="small" />}
                size="small"
              >
                Save
              </LoadingButton>
              <LoadingButton
                color="inherit"
                disabled={!draft || previewing !== 0 || !groups.includes('Editors')}
                loading={previewing > 0}
                loadingPosition="start"
                size="small"
                onClick={handlePreview}
                startIcon={<VisibilityIcon fontSize="small" />}
              >
                Preview
              </LoadingButton>
            </Stack>
            <Stack spacing={2} direction="row">
              <Button
                color="inherit"
                onClick={() => setMonetizationDialog(true)}
                size="small"
                startIcon={<AttachMoneyIcon />}
              >
                Monetize
              </Button>
              <LoadingButton
                color="inherit"
                disabled={!draft || saving !== 0 || publishing !== 0 || previewing !== 0 || !groups.includes('Editors')}
                endIcon={<PublishIcon fontSize="small" />}
                loading={publishing !== 0}
                loadingPosition="end"
                onClick={handlePublish}
                size="small"
                variant="outlined"
              >
                Publish
              </LoadingButton>
            </Stack>
          </Toolbar>

          {media ? (
            <Box sx={{ pt: 2, pb: 2 }}>
              <Container maxWidth="sm">
                <Box
                  sx={{
                    mb: 2,
                    display: pip ? 'none' : 'block',
                    position: 'relative',
                    paddingTop: '56.25%',
                    '& .reactPlayer': { position: 'absolute', top: 0, left: 0 },
                  }}
                >
                  <ReactPlayer
                    className="reactPlayer"
                    config={config}
                    height="100%"
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
                    style={{ lineHeight: 0 }}
                    url={media.url}
                    width="100%"
                  />
                </Box>
                <Stack spacing={2} direction="row" sx={{ alignItems: 'center', pr: { lg: 2 } }}>
                  {buffering && seekTime !== time ? (
                    <IconButton onClick={pause} color="inherit">
                      {seekTime - time > 0 ? <FastForwardIcon /> : <FastRewindIcon />}
                    </IconButton>
                  ) : playing ? (
                    <IconButton onClick={pause} color="inherit">
                      <PauseIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={play} color="inherit">
                      <PlayArrowIcon />
                    </IconButton>
                  )}
                  <Slider
                    aria-label="timeline"
                    defaultValue={0}
                    max={duration}
                    min={0}
                    onChange={handleSliderChange}
                    size="small"
                    sx={{ color: 'white' }}
                    value={time}
                    valueLabelDisplay="auto"
                    valueLabelFormat={timecode}
                  />
                </Stack>
              </Container>
            </Box>
          ) : (
            <Box sx={{ pt: 2, pb: 4 }}>
              <Container maxWidth="sm">
                <Skeleton
                  height="360px"
                  sx={{ lineHeight: 0, mb: 2.5, borderRadius: 1 }}
                  variant="rectangular"
                  width="100%"
                />
                <Skeleton variant="rectangular" width="100%" height="20px" sx={{ borderRadius: 1 }} />
              </Container>
            </Box>
          )}
        </Box>
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
                  <Container maxWidth="sm" className="Left">
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
                        setSpeakers={NOOP}
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
                  <Container maxWidth="sm" className="Right">
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
                        setSpeakers={setSpeakers}
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
                  {...{ initialState, time, seekTo, speakers, setSpeakers, playing, play, pause }}
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
      <Menu
        anchorEl={langAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        id="account-menu"
        onClick={() => setLangAnchorEl(null)}
        onClose={() => setLangAnchorEl(null)}
        open={Boolean(langAnchorEl)}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        MenuListProps={{
          dense: true,
          'aria-labelledby': 'translations-button',
        }}
        PaperProps={{
          style: {
            maxHeight: '300px',
            width: '160px',
          },
        }}
      >
        <MenuItem onClick={onNewTranslation} disabled={!showTranslate}>
          <ListItemText primary="New translation…" primaryTypographyProps={{ color: 'primary' }} />
        </MenuItem>
        <Divider />
        {transcripts.map(t => {
          return (
            <MenuItem
              component={Link}
              href={{ query: { media: t.media, transcript: t.id } }}
              key={t.id}
              selected={t.id === transcript?.id}
            >
              {ISO6391.getName(t.language.split('-')[0])}
            </MenuItem>
          );
          {
            /* // return (
          //   <MenuItem selected={t.id === translation?.id} key={t.id} onClick={onSelectTranslation(t)}>
          //     {t.name}
          //   </MenuItem>
          // );
          return <TranslationMenuItem key={t.id} {...{ translation, t, onSelectTranslation }} />; */
          }
        })}
      </Menu>
      {langDialog && (
        <NewTranslation
          onClose={() => setLangDialog(false)}
          open={langDialog}
          onSubmit={createTranslation}
          progress={translationProgress}
        />
      )}
      {monetizationDialog && (
        <MonetizationDialog
          onClose={() => setMonetizationDialog(false)}
          onSubmit={onSubmitMonetization}
          open={monetizationDialog}
          speakers={speakers}
        />
      )}
    </>
  ) : null;
};

const TranslationMenuItem = ({ t, onSelectTranslation, translation }) => {
  const onClick = useCallback(() => onSelectTranslation(t), [onSelectTranslation, t]);

  return (
    <MenuItem selected={t.id === translation?.id} key={t.id} onClick={onClick}>
      {t.name}
    </MenuItem>
  );
};

const NOOP = () => {};

const timecode = (seconds, frameRate = 25, dropFrame = false) =>
  TC(seconds * 25, 25, false)
    .toString()
    .split(':')
    .slice(0, 3)
    .join(':');

export default EditorPage;
