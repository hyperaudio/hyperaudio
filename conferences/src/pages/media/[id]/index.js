import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';

import { styled } from '@mui/material/styles';

import Remixer from '@hyperaudio/remixer';

import { Media, Channel, Transcript } from '../../../models';

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

const getMedia = async (setMedia, id) => setMedia(await DataStore.query(Media, id));
const getTranscripts = async (setTranscripts, id) =>
  setTranscripts((await DataStore.query(Transcript)).filter(t => t.media === id));

const MediaPage = () => {
  const router = useRouter();
  const id = useMemo(() => router.query.id, [router.query]);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [data, setData] = useState();

  console.log({ id, media, transcripts, data });

  useEffect(() => {
    getMedia(setMedia, id);

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setMedia, id));
    window.addEventListener('online', () => navigator.onLine && getMedia(setMedia, id));

    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    window.DataStore = DataStore;
    getTranscripts(setTranscripts, id);

    const subscription = DataStore.observe(Media).subscribe(msg => getTranscripts(setTranscripts, id));
    window.addEventListener('online', () => navigator.onLine && getTranscripts(setTranscripts, id));

    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!media) return;
    (async () => {
      const sources = await Promise.all(
        transcripts.map(async transcript => ({
          ...transcript,
          media: [
            {
              id: media.playbackId,
              url: media.url,
              poster: media.poster,
            },
          ],
          channel: media.channel,
          tags: media.tags ?? [],
          transcript: {
            title: transcript.title,
            translations: [{ id: transcript.id, lang: 'en-US', name: 'English', default: true }],
          },
          remixes: [],
          blocks: await (await fetch(transcript.url)).json(),
        })),
      );
      setData({
        sources,
      });
    })();
  }, [media, transcripts]);

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      {data && data.sources && data.sources.length > 0 ? (
        <Remixer editable={false} isSingleMedia={true} media={data.sources} remix={null} sources={data.sources} />
      ) : null}
    </Root>
  );
};

export default MediaPage;
