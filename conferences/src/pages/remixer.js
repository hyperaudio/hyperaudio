import Head from 'next/head';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';
import { useRouter } from 'next/router';
import isEqual from 'react-fast-compare';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

import Remixer from '../components/remixer';
import { useThrottledResizeObserver } from '@hyperaudio/common';

import { Media, Channel, Transcript, Remix, RemixMedia } from '../models';
import MediaInfoDialog from 'src/components/media/MediaInfoDialog';

const PREFIX = 'RemixerPage';
const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
};

const Root = styled(Box, {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  [`& .${classes.toolbar}`]: {
    background: 'black',
    color: theme.palette.primary.contrastText,
    zIndex: 1,
    '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
  },
}));

const getMedia = async setAllMedia => setAllMedia(await DataStore.query(Media));
const getTranscripts = async setAllTranscripts => setAllTranscripts(await DataStore.query(Transcript)); // .filter(t => t.media === id)

const RemixerPage = ({ organisation }) => {
  const { ref, height = 0 } = useThrottledResizeObserver(0);
  const router = useRouter();
  const {
    query: { transcripts: transcriptIds },
  } = router;

  const [allMedia, setAllMedia] = useState([]);
  const [allTranscripts, setAllTranscripts] = useState([]);
  const [media, setMedia] = useState();
  const [remix, setRemix] = useState([]);
  const [data, setData] = useState();

  console.log({ id: null, allMedia, allTranscripts, media, remix, data });

  useEffect(() => {
    getTranscripts(setAllTranscripts);

    const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setAllTranscripts));
    window.addEventListener('online', () => navigator.onLine && getTranscripts(setAllTranscripts));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getMedia(setAllMedia);

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setAllMedia));
    window.addEventListener('online', () => navigator.onLine && getMedia(setAllMedia));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (allTranscripts.length === 0 || allMedia.length === 0 || !transcriptIds) return;

    (async () => {
      const transcripts = await Promise.all(
        allTranscripts
          .filter(({ id }) => transcriptIds.split(',').includes(id))
          .map(async t => ({ ...t, blocks: await (await fetch(t.url)).json() })),
      );

      console.log({ transcripts });

      const tabs = transcripts.map(t => {
        const media = allMedia.find(m => m.id === t.media);
        const { speakers, blocks } = t.blocks;
        const blocks2 = blocks
          .map(({ key, text, data: { start: _start, end: _end, speaker, items: _items } }, i, arr) => {
            const prev = i > 0 ? arr[i - 1] : null;
            const next = i < arr.length - 1 ? arr[i + 1] : null;

            const start = (_items[0].start ?? _start ?? prev?.data?.end ?? 0) * 1e3;
            const end = (_items[_items.length - 1].end ?? _end ?? next?.data?.start ?? start) * 1e3;

            const items = _items.map((item, j) => {
              const pitem = j > 0 ? _items[j - 1] : null;
              const nitem = j < _items.length - 1 ? _items[j + 1] : null;

              return {
                text: item.text,
                start: (item.start ?? pitem?.end ?? start / 1e3) * 1e3,
                end: (item.end ?? nitem?.start ?? item.start ?? end / 1e3) * 1e3,
              };
            });

            return {
              text,
              type: 'block',
              key: key ?? nanoid(5),
              media: media.playbackId,
              speaker: speakers?.[speaker]?.name ?? speaker,
              start,
              end,
              starts: items.map(({ start }) => start),
              duration: end - start,
              ends: items.map(({ end }) => end),
              durations: items.map(({ start, end }) => end - start),
              starts2: items.map(({ start }) => start - items[0].start),
              ends2: items.map(({ end }) => end - items[0].start),
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
            p.gap = p.end ? block.start - p.end : 0;
            return [...acc, p, block];
          }, []);

        return {
          ...t,
          blocks: blocks2,
          // blocks2: t.blocks.map(b => ({ ...b, media: t.media })),
          media: [{ id: media.playbackId, url: media.url, poster: media.poster }],
        };
      });

      const sources = allMedia
        .filter(({ status: { label } }) => label === 'published')
        .map(media => {
          const t = allTranscripts.find(t => t.media === media.id && t.language === media.language);
          return {
            ...t,
            blocks: [],
            media: [{ id: media.playbackId, url: media.url, poster: media.poster }],
          };
        });

      setData({
        sources,
        tabs,
        remix: {
          id: 'remix-id',
          title: '',
          media: tabs.map(s => s.media[0]),
          blocks: [],
        },
      });
    })();
  }, [allMedia, allTranscripts, transcriptIds]);

  console.log('remixer page', { media, data });

  const getFullSource = useCallback(async source => {
    console.log('getFullSource', source);

    if (source.blocks.length > 0) return source;

    const { speakers, blocks } = await (await fetch(source.url)).json();
    const {
      media: [media],
    } = source;

    const blocks2 = blocks
      .map(({ key, text, data: { start: _start, end: _end, speaker, items: _items } }, i, arr) => {
        const prev = i > 0 ? arr[i - 1] : null;
        const next = i < arr.length - 1 ? arr[i + 1] : null;

        const start = (_items[0].start ?? _start ?? prev?.data?.end ?? 0) * 1e3;
        const end = (_items[_items.length - 1].end ?? _end ?? next?.data?.start ?? start) * 1e3;

        const items = _items.map((item, j) => {
          const pitem = j > 0 ? _items[j - 1] : null;
          const nitem = j < _items.length - 1 ? _items[j + 1] : null;

          return {
            text: item.text,
            start: (item.start ?? pitem?.end ?? start / 1e3) * 1e3,
            end: (item.end ?? nitem?.start ?? item.start ?? end / 1e3) * 1e3,
          };
        });

        return {
          text,
          type: 'block',
          key: key ?? nanoid(5),
          media: media.id,
          speaker: speakers?.[speaker]?.name ?? speaker,
          start,
          end,
          starts: items.map(({ start }) => start),
          duration: end - start,
          ends: items.map(({ end }) => end),
          durations: items.map(({ start, end }) => end - start),
          starts2: items.map(({ start }) => start - items[0].start),
          ends2: items.map(({ end }) => end - items[0].start),
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
        p.gap = p.end ? block.start - p.end : 0;
        return [...acc, p, block];
      }, []);

    console.log('getFullSource:', source, { ...source, blocks: blocks2 });

    return { ...source, blocks: blocks2 };
  }, []);

  return (
    <>
      <Head>
        <title>
          Remix: {media?.title ? `“${media.title}”` : 'Untitled'} • {organisation.name} @ hyper.audio
        </title>
      </Head>
      <Root className={classes.root}>
        {data && data.sources && data.sources.length > 0 && (
          <>
            <Toolbar ref={ref} />
            <Remixer
              editable={true}
              remix={data.remix}
              sources={data.sources}
              tabs={data.tabs}
              media={[]}
              isSingleMedia={false}
              getFullSource={getFullSource}
              sx={{
                '& > *': { flex: '0 0 50%' },
                bottom: 0,
                display: 'flex',
                left: 0,
                position: 'absolute',
                right: 0,
                top: 0,
                top: `${height}px`,
                zIndex: 1,
              }}
            />
          </>
        )}
      </Root>
    </>
  );
};

export default RemixerPage;

// <Remixer
//   editable={false}
//   // isSingleMedia={true}
//   showSource={false}
//   hideToggleSource={true}
//   media={data.sources}
//   remix={data.remix}
//   sources={data.sources}
// />
