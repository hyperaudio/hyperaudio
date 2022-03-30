import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection, Storage } from 'aws-amplify';
import { nanoid } from 'nanoid';

import { styled } from '@mui/material/styles';

import { Editor } from '@hyperaudio/editor';

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
    query: {
      media: mediaId = '335471dd-681e-4ab1-8e23-21595938024c',
      transcript: transcriptId = '052da9b5-02a3-4c52-b272-684e659d3f9e',
    },
  } = router;

  useEffect(() => {
    if (user === null)
      router.push(`/auth?redirect=${encodeURIComponent(`/editor?media=${mediaId}&transcript=${transcriptId}`)}`);
  }, [user]);

  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [data, setData] = useState();
  const transcript = useMemo(() => transcripts.filter(t => t.id === transcriptId)?.[0], [transcriptId, transcripts]);

  useEffect(() => {
    getMedia(setMedia, mediaId);

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setMedia, mediaId));
    window.addEventListener('online', () => navigator.onLine && getMedia(setMedia, mediaId));
    return () => subscription.unsubscribe();
  }, [mediaId]);

  useEffect(() => {
    getTranscripts(setTranscripts, mediaId);

    const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setTranscripts, mediaId));
    window.addEventListener('online', () => navigator.onLine && getTranscripts(setTranscripts, mediaId));
    return () => subscription.unsubscribe();
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
          data: {
            ...block.data,
            speaker: Object.entries(speakers).find(([id, { name }]) => name === block.data.speaker)?.[0],
          },
        }));
      }

      setData({ speakers, blocks });
    })();
  }, [transcript]);

  console.log({ mediaId, transcriptId, media, transcripts, transcript, data });

  const handleSave = useCallback(async () => {
    const result = await Storage.put('test.txt', 'Test Content', {
      level: 'public',
      contentType: 'text/plain',
    });

    console.log(result);

    const signedURL = await Storage.get('test.txt', { level: 'public' });
    console.log(signedURL);
  }, []);

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      <h1>test</h1>
      <button onClick={handleSave}>Save</button>
      {/* <Editor /> */}
    </Root>
  );
};

export default EditorPage;
