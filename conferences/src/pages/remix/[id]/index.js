import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';

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

const getRemix = async (setRemixes, id) => {
  return setRemixes((await DataStore.query(RemixMedia)).filter(r => r.remix.id === id).map(r => r.remix)[0]);
};

const RemixPage = () => {
  const router = useRouter();
  const id = useMemo(() => router.query.id, [router.query]);
  const [media, setMedia] = useState();
  const [remix, setRemix] = useState([]);
  const [data, setData] = useState();

  console.log({ id, media, remix, data });

  useEffect(() => {
    getRemix(setRemix, id);

    const subscription = DataStore.observe(RemixMedia).subscribe(msg => getRemix(setRemix, id));
    window.addEventListener('online', () => navigator.onLine && getRemix(setRemix, id));
    return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!remix) return;
    (async () => {
      const r = await (await fetch(remix.url)).json();
      const sources = [
        {
          ...remix,
          media: r.media,
          channel: { id: 0, name: 'no channel' },
          // tags: media.tags ?? [],
          transcript: {
            title: remix.title,
            translations: [{ id: remix.id, lang: 'en-US', name: 'English', default: true }],
          },
          remixes: [],
          blocks: r.blocks,
        },
      ];

      setData({ sources });
    })();
  }, [media, remix]);

  console.log({ media, data });

  return (
    <Root className={classes.root}>
      <div className={classes.push} />
      {data && data.sources && data.sources.length > 0 ? (
        <Remixer editable={false} isSingleMedia={true} media={data.sources} remix={null} sources={data.sources} />
      ) : null}
    </Root>
  );
};

export default RemixPage;
