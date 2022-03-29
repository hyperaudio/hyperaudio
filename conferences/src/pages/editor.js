import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection, Storage } from 'aws-amplify';

import { styled } from '@mui/material/styles';

import { Editor } from '@hyperaudio/editor';

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
    query: {
      media: mediaId = '3c703162-6597-4c14-8d61-7aa9ec46a8f7',
      transcript: transcriptId = '9a4d56c4-f6f3-4472-8283-5655cd3ebf26',
    },
  } = router;

  useEffect(() => {
    if (user === null)
      router.push(`/auth?redirect=${encodeURIComponent(`/editor?media=${mediaId}&transcript=${transcriptId}`)}`);
  }, [user]);

  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);

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

  const transcript = useMemo(() => transcripts.filter(t => t.id === transcriptId)?.[0], [transcriptId, transcripts]);

  console.log({ mediaId, transcriptId, media, transcripts, transcript });

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
