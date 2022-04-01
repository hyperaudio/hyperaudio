import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Storage, DataStore, Predicates, SortDirection } from 'aws-amplify';
import { nanoid } from 'nanoid';
import axios from 'axios';

import { styled } from '@mui/material/styles';

import Remixer from '@hyperaudio/remixer';

import { Media, Channel, Transcript, Remix, RemixMedia } from '../../../models';

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

const getRemixes = async (setRemixes, id) =>
  setRemixes((await DataStore.query(RemixMedia)).filter(r => r.media.id === id).map(r => r.remix));

const MediaPage = ({ user, groups = [] }) => {
  const router = useRouter();
  global.router = router; // FIXME

  const {
    query: { showPreview, transcript: transcriptId },
  } = router;
  const showDraft = useMemo(() => groups.includes('Editors'), [groups]);

  const id = useMemo(() => router.query.id, [router.query]);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [remixes, setRemixes] = useState([]);
  const [data, setData] = useState();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState();

  console.log({ id, media, transcripts, remixes, data });

  useEffect(() => {
    getMedia(setMedia, id);

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setMedia, id));
    window.addEventListener('online', () => navigator.onLine && getMedia(setMedia, id));
    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    getTranscripts(setTranscripts, id);

    const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setTranscripts, id));
    window.addEventListener('online', () => navigator.onLine && getTranscripts(setTranscripts, id));
    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    getRemixes(setRemixes, id);

    const subscription = DataStore.observe(RemixMedia).subscribe(msg => getRemixes(setRemixes, id));
    window.addEventListener('online', () => navigator.onLine && getRemixes(setRemixes, id));
    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!media) return;
    (async () => {
      const sources = await Promise.all(
        transcripts.map(async transcript => {
          let speakers;
          let blocks;

          if (showDraft || showPreview) {
            try {
              const signedURL = await Storage.get(
                `transcript/${media.playbackId}/${transcript.language}/${transcript.id}${
                  showPreview ? '-preview' : ''
                }.json`,
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
              console.error(error);
              setError(error);
            }
          }

          if (!speakers || !blocks) {
            try {
              const result = (
                await axios.get(transcript.url, {
                  onDownloadProgress: progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // setProgress(percentCompleted === Infinity ? 100 : percentCompleted);
                    setProgress(
                      progressEvent.lengthComputable ? (percentCompleted === Infinity ? 100 : percentCompleted) : 75,
                    );
                  },
                })
              ).data;
              speakers = result.speakers;
              blocks = result.blocks;
            } catch (error) {
              console.error(error);
              setError(error);
            }
          }

          // if (blocks.blocks) {
          // const speakers = blocks.speakers;
          blocks = blocks
            .map(({ text, data: { start, end, speaker, items } }) => {
              return {
                text,
                type: 'block',
                key: nanoid(5),
                media: media.playbackId,
                speaker: speakers?.[speaker]?.name ?? speaker,
                start: items[0].start * 1e3,
                end: items[items.length - 1].end * 1e3,
                starts: items.map(({ start }) => start * 1e3),
                duration: (items[items.length - 1].end - items[0].start) * 1e3,
                ends: items.map(({ end }) => end * 1e3),
                durations: items.map(({ start, end }) => (end - start) * 1e3),
                starts2: items.map(({ start }) => (start - items[0].start) * 1e3),
                ends2: items.map(({ end }) => (end - items[0].start) * 1e3),
                offsets: items.map(({ text }, i, arr) => {
                  if (i === 0) return 0;
                  return arr.slice(0, i).reduce((acc, item) => acc + item.text.length + 1, 0);
                }),
                lengths: items.map(({ text }) => text.length),
                gap: 0,
              };
            })
            .reduce((acc, block, i) => {
              if (i === 0) return [block];
              const p = acc.pop();
              p.gap = block.start - p.end;
              return [...acc, p, block];
            }, []);
          // }

          return {
            ...transcript,
            media: [
              {
                id: media.playbackId,
                url: media.url,
                poster: media.poster,
                mediaId: media.id,
              },
            ],
            channel: media.channel,
            tags: media.tags ?? [],
            transcript: {
              title: transcript.title,
              translations: [{ id: transcript.id, lang: 'en-US', name: 'English', default: true }],
            },
            remixes: remixes.map(r => ({ ...r, href: `/remix/${r.id}` })),
            blocks,
          };
        }),
      );
      // setData({
      //   sources:
      //     sources.length > 0
      //       ? sources
      //       : [
      //           {
      //             id: media.id,
      //             title: media.title,
      //             language: media.language,
      //             channel: media.channel,
      //             media: [
      //               {
      //                 id: media.playbackId,
      //                 url: media.url,
      //                 poster: media.poster,
      //               },
      //             ],
      //             channel: media.channel,
      //             tags: media.tags ?? [],
      //             transcript: {
      //               title: media.title,
      //               translations: [{ id: media.id, lang: 'en-US', name: 'English', default: true }],
      //             },
      //             remixes: [],
      //             blocks: [],
      //           },
      //         ],
      // });
      setData({ sources });
    })();
  }, [media, transcripts, remixes, showDraft, showPreview]);

  console.log({ media, data });

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      {data && data.sources && data.sources.length > 0 ? (
        <Remixer
          editable={false}
          isSingleMedia={true}
          media={data.sources}
          remix={null}
          sources={data.sources}
          autoScroll={true}
          mediaLabel={showDraft ? 'DRAFT' : showPreview ? 'PREVIEW' : null}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', textAlign: 'center', paddingTop: 200 }}>
          Loading <span style={{ width: '3em', display: 'inline-block', textAlign: 'right' }}>{`${progress}%`}</span>
          {error && <p>Error: {error?.message}</p>}
        </div>
      )}
    </Root>
  );
};

export default MediaPage;
