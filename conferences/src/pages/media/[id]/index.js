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

import Remixer from '@hyperaudio/remixer';

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

const getMedia = async (setMedia, id) => {
  const media = await DataStore.query(Media, m => m.id('eq', id));
  if (media?.[0]) setMedia(media?.[0]);
};

const getTranscripts = async (setTranscripts, id) =>
  setTranscripts((await DataStore.query(Transcript)).filter(t => t.media === id));

const getRemixes = async (setRemixes, id) =>
  setRemixes((await DataStore.query(RemixMedia)).filter(r => r.media.id === id).map(r => r.remix));

const MediaPage = ({ organisation, user, groups = [] }) => {
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

            if (showDraft || showPreview || transcriptUrl) {
              setLabel(showDraft ? 'DRAFT' : showPreview ? 'PREVIEW' : null);
              try {
                let key = `transcript/${media.playbackId}/${transcript.language}/${transcript.id}${
                  showPreview ? '-preview.json.gz' : '.json.gz'
                }`;

                // if (language !== media.language)
                //   key = `transcript/${media.playbackId}/${transcript.language}/translation.json.gz`;

                let signedURL;
                if (showDraft && transcript.metadata.draft) {
                  signedURL = await Storage.get(transcript.metadata.draft.key, {
                    level: transcript.metadata.draft.level,
                    identityId: transcript.metadata.draft.identityId,
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
                let url = transcript.url;
                if (transcript?.status?.label === 'published') {
                  if (transcript?.metadata?.published?.url) {
                    url = transcript?.metadata?.published?.url ?? url;
                  } else if (transcript?.metadata?.published?.key) {
                    url = await Storage.get(transcript.metadata.published.key, {
                      level: transcript.metadata.published.level,
                      identityId: transcript.metadata.published.identityId,
                    });
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
                    // .filter(t => showDraft || t.status?.label === 'published')
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
  }, [media, transcripts, remixes, language, showDraft, showPreview, transcriptUrl]);

  useEffect(() => console.log({ data }), [data]);
  // console.log({ data });

  const onSelectTranslation = useCallback(
    t => {
      // console.log('onSelectTranslation:', t);
      router.push(`/media/${media.id}?language=${t.lang}`, undefined, { shallow: true });
    },
    [router, media],
  );

  return (
    <>
      <Head>
        <title>
          Media: {media?.title ? `“${media.title}”` : 'Untitled'} • {organisation.name} @ hyper.audio
        </title>
      </Head>
      <Root className={classes.root}>
        <Toolbar />
        {data && data.sources && data.sources.length > 0 && (
          <Box
            sx={{
              bgcolor: 'black',
              color: 'white',
              width: '100%',
              '& .Mui-disabled': { color: 'rgba(255,255,255,0.5) !important' },
            }}
          >
            <MediaTopbar
              canEdit={groups.includes('Editors')}
              mediaLabel={label}
              onSelectTranslation={onSelectTranslation}
              source={data?.sources[0]}
            />
          </Box>
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
          />
        ) : (
          <div style={{ width: '100%', height: '100%', textAlign: 'center', paddingTop: 200 }}>
            Loading <span style={{ width: '3em', display: 'inline-block', textAlign: 'right' }}>{`${progress}%`}</span>
            {error && <p>Error: {error?.message}</p>}
          </div>
        )}
      </Root>
    </>
  );
};

export default MediaPage;
