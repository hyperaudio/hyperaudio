import Head from 'next/head';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Storage, DataStore, Predicates, SortDirection } from 'aws-amplify';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import ISO6391 from 'iso-639-1';

import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

import Remixer from '@hyperaudio/remixer';
import { useThrottledResizeObserver } from '@hyperaudio/common';

import MediaTopbar from '../../../components/media/MediaTopbar';
import { Media, Channel, Transcript, Remix, RemixMedia } from '../../../models';

const PREFIX = 'MediaPage';
const classes = {
  root: `${PREFIX}-root`,
  push: `${PREFIX}-push`,
};

global.diff = diff;

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
}));

function SkeletonLoader() {
  const dummytextarr = [...Array(5).keys()];
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width={550} height={(550 * 9) / 16} />
        </Grid>
      </Grid>
      {[...Array(5).keys()].map(key1 => (
        <>
          <Grid container spacing={1} key={key1}>
            <Grid item xs={12}>
              <Skeleton variation="text" sx={{ width: '100%' }} />
            </Grid>
          </Grid>
          {dummytextarr.map((key2, i) => (
            <Grid container spacing={1} key={key2}>
              <Grid item xs={12}>
                <Skeleton variation="text" sx={{ width: i === dummytextarr.length - 1 ? '66%' : '100%' }} />
              </Grid>
            </Grid>
          ))}
        </>
      ))}
    </>
  );
}

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, m => m.id('eq', id));
  if (media?.[0]) setMedia(media?.[0]);
};

const getTranscripts = async (setTranscripts, id) =>
  setTranscripts((await DataStore.query(Transcript)).filter(t => t.media === id));

const getRemixes = async (setRemixes, id) =>
  setRemixes((await DataStore.query(RemixMedia)).filter(r => r.media.id === id).map(r => r.remix));

const MediaPage = ({ organisation, user, framed, groups = [] }) => {
  const { ref, height = 0 } = useThrottledResizeObserver(0);
  const router = useRouter();
  global.router = router; // FIXME
  // console.log({ user });

  const {
    query: { language, showPreview, transcriptUrl, transcript: transcriptId },
  } = router;
  const showDraft = useMemo(() => groups.includes('Editors'), [groups]);

  const [label, setLabel] = useState();

  const id = useMemo(() => router.query.id, [router.query]);
  const [media, setMedia] = useState();
  const [transcripts, setTranscripts] = useState([]);
  const [remixes, setRemixes] = useState([]);
  const [data, setData] = useState();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState();

  useEffect(() => console.log({ id, media, transcripts, remixes, data }), [id, media, transcripts, remixes, data]);

  useEffect(() => {
    getMedia(setMedia, id);

    // const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setMedia, id));
    // window.addEventListener('online', () => navigator.onLine && getMedia(setMedia, id));
    // return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    getTranscripts(setTranscripts, id);

    // const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setTranscripts, id));
    // window.addEventListener('online', () => navigator.onLine && getTranscripts(setTranscripts, id));
    // return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    getRemixes(setRemixes, id);

    // const subscription = DataStore.observe(RemixMedia).subscribe(msg => getRemixes(setRemixes, id));
    // window.addEventListener('online', () => navigator.onLine && getRemixes(setRemixes, id));
    // return () => subscription.unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!media || transcripts.length === 0) return;
    (async () => {
      const sources = await Promise.all(
        transcripts
          .filter(({ language: lang }) => lang === (language ?? media.language))
          .map(async transcript => {
            let speakers;
            let blocks;

            let t = transcript;
            try {
              t = (await axios.get(await Storage.get(`data/${transcript.id}.json.gz`, { level: 'public' }))).data;
            } catch (ignored) {}

            if (showDraft || showPreview || transcriptUrl) {
              setLabel(showDraft ? 'DRAFT' : showPreview ? 'PREVIEW' : null);
              try {
                let key = `transcript/${media.playbackId}/${transcript.language}/${transcript.id}${
                  showPreview ? '-preview.json.gz' : '.json.gz'
                }`;

                // if (language !== media.language)
                //   key = `transcript/${media.playbackId}/${transcript.language}/translation.json.gz`;

                let signedURL;
                if (showDraft && t.metadata.draft) {
                  signedURL = await Storage.get(t.metadata.draft.key, {
                    level: t.metadata.draft.level,
                    identityId: t.metadata.draft.identityId,
                  });
                } else {
                  signedURL = await Storage.get(key, {
                    level: 'public',
                  });
                }

                const result = (
                  await axios.get(transcriptUrl ? transcriptUrl : signedURL, {
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
                // setError({
                //   message: `${showDraft ? 'Draft' : showPreview ? 'Preview' : 'Published'} transcript: ${
                //     error.message
                //   }; Failover: loading original transcript`,
                // });
                setLabel(null);
              }
            }

            if (!speakers || !blocks) {
              setLabel(null);
              try {
                let url = t.url;
                if (t?.status?.label === 'published') {
                  if (
                    t?.metadata?.published?.key &&
                    t?.metadata?.published?.level &&
                    t?.metadata?.published?.identityId
                  ) {
                    url = await Storage.get(t.metadata.published.key, {
                      level: t.metadata.published.level,
                      identityId: t.metadata.published.identityId,
                    });
                  } else if (t?.metadata?.published?.url) {
                    url = t?.metadata?.published?.url ?? url;
                  }
                }

                const result = (
                  await axios.get(url, {
                    // TODO use original url as fallback
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
            // }

            return {
              ...transcript,
              media: [
                {
                  id: media.playbackId,
                  url: media.url,
                  poster: media.poster.replace('.png', '.jpg'),
                  mediaId: media.id,
                  title: transcript.title,
                },
              ],
              channel: media.channel,
              tags: media.tags ?? [],
              transcript: {
                title: transcript.title,
                // translations: [{ id: transcript.id, lang: 'en-US', name: 'English', default: true }],
                translations: [
                  ...transcripts
                    .filter(t => showDraft || t.status?.label === 'published')
                    .filter(t => t.language === (language ?? media.language))
                    .map(({ id, language: lang, title }) => ({
                      id,
                      lang,
                      name: ISO6391.getName(lang.split('-')[0]),
                      title,
                      default: true,
                    })),
                  ...transcripts
                    .filter(t => showDraft || t.status?.label === 'published')
                    .filter(t => t.language !== (language ?? media.language))
                    .map(({ id, language: lang, title }) => ({
                      id,
                      lang,
                      name: ISO6391.getName(lang.split('-')[0]),
                      title,
                      default: false,
                    })),
                ],
              },
              remixes: remixes.map(r => ({ ...r, href: `/remix/${r.id}` })),
              blocks,
            };
          }),
      );
      setData({ sources });
    })();
  }, [media, transcripts, remixes, language, showDraft, showPreview, transcriptUrl]);

  useEffect(() => console.log({ data }), [data]);
  // console.log({ data });

  const onSelectTranslation = useCallback(
    t => {
      // console.log('onSelectTranslation:', t);
      // router.push(`/media/${media.id}?language=${t.lang}`, undefined, { shallow: false });
      document.location.href = `/media/${media.id}?language=${t.lang}`;
    },
    [router, media],
  );

  // FIXME title and desc should be transcript not media
  return (
    <>
      <Head>
        <title>
          Media: {media?.title ? `“${media.title}”` : 'Untitled'} • {organisation.name} @ hyper.audio
        </title>
        {media && <meta name="description" content={media.description} />}
      </Head>
      <Root className={classes.root}>
        {!framed && <Toolbar ref={ref} />}
        {data && data.sources && data.sources.length > 0 && (
          <MediaTopbar
            canEdit={groups.includes('Editors')}
            mediaLabel={label}
            onSelectTranslation={onSelectTranslation}
            source={data?.sources[0]}
          />
        )}
        {data && data.sources && data.sources.length > 0 ? (
          <Remixer
            autoScroll={true}
            canEdit={groups.includes('Editors')}
            editable={false}
            isSingleMedia={true}
            media={data.sources}
            mediaLabel={label}
            onSelectTranslation={onSelectTranslation}
            remix={null}
            sources={data.sources}
            sx={{ top: `${height * 2}px`, left: 0, bottom: 0, right: 0, position: 'absolute', zIndex: 1 }}
          />
        ) : (
          <div style={{ width: '550px', height: '100%', textAlign: 'center', paddingTop: 50, margin: 'auto' }}>
            {/* Loading <span style={{ width: '3em', display: 'inline-block', textAlign: 'right' }}>{`${progress}%`}</span> */}
            {error && <p>Error: {error?.message}</p>}
            <SkeletonLoader />
          </div>
        )}
      </Root>
    </>
  );
};

export default MediaPage;
