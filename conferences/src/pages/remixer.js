import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';

import { styled } from '@mui/material/styles';

import Remixer from '@hyperaudio/remixer';

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

const getMedia = async setAllMedia => setAllMedia(await DataStore.query(Media));
const getTranscripts = async setAllTranscripts => setAllTranscripts(await DataStore.query(Transcript)); // .filter(t => t.media === id)

const RemixerPage = () => {
  const router = useRouter();
  // const id = useMemo(() => router.query.id, [router.query]);
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
    if (allTranscripts.length === 0 || allMedia.length === 0) return;

    (async () => {
      const transcripts = await Promise.all(
        allTranscripts.map(async t => ({ ...t, blocks: await (await fetch(t.url)).json() })),
      );

      console.log({ transcripts });

      const sources = transcripts.map(t => {
        const media = allMedia.find(m => m.id === t.media);
        return {
          ...t,
          // blocks2: t.blocks.map(b => ({ ...b, media: t.media })),
          media: [{ id: media.playbackId, url: media.url, poster: media.poster }],
        };
      });

      setData({
        sources,
        remix: {
          id: 'remix-id',
          title: '',
          media: sources.map(s => s.media[0]),
          blocks: [],
        },
      });
    })();
  }, [allMedia, allTranscripts]);

  console.log({ media, data });

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      {data && data.sources && data.sources.length > 0 ? (
        <Remixer editable={true} remix={data.remix} sources={data.sources} media={[]} />
      ) : null}
    </Root>
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
