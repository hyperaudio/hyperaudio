import React, { useState, useCallback, useEffect, useReducer, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';

import { styled } from '@mui/material/styles';

import { MediaTable } from '@hyperaudio/common';

import { Main } from '../../components';
import { Media, Channel, Transcript } from '../../models';

const PREFIX = `DashboardPage`;
const classes = {
  root: `${PREFIX}-Root`,
  thumbTitle: `${PREFIX}-thumbTitle`,
};

const Root = styled(
  'div',
  {},
)(({ theme }) => ({
  [`& .${classes.thumbTitle} span`]: {
    lineHeight: '1.44em !important',
  },
}));

const getMedia = async setAllMedia => setAllMedia(await DataStore.query(Media));
const getTranscripts = async setAllMedia => setAllMedia(await DataStore.query(Transcript));
const getChannels = async setAllMedia => setAllMedia(await DataStore.query(Channel));

const DashboardPage = props => {
  const router = useRouter();
  const { user, groups = [] } = props;

  const [allMedia, setAllMedia] = useState([]);
  const [allTranscripts, setAllTranscripts] = useState([]);
  const [allChannels, setChannels] = useState([]);

  useEffect(() => {
    if (user === null) router.push(`/auth?redirect=${encodeURIComponent(`/dashboard`)}`);
  }, [user, router]);

  useEffect(() => {
    getMedia(setAllMedia);

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setAllMedia));
    window.addEventListener('online', () => navigator.onLine && getMedia(setAllMedia));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getTranscripts(setAllTranscripts);

    const subscription = DataStore.observe(Transcript).subscribe(msg => getTranscripts(setAllTranscripts));
    window.addEventListener('online', () => navigator.onLine && getTranscripts(setAllTranscripts));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getChannels(setChannels);

    const subscription = DataStore.observe(Channel).subscribe(msg => getChannels(setChannels));
    window.addEventListener('online', () => navigator.onLine && getChannels(setChannels));

    return () => subscription.unsubscribe();
  }, []);

  // console.group('DashboardPage');
  // console.log({ allMedia, allChannels, allTranscripts });
  // console.groupEnd();

  const onClickMedia = useCallback(id => router.push(`/media/${id}`), [router]);
  const onEditMedia = useCallback(
    ([id]) => {
      const transcript = allTranscripts.find(t => t.media === id);
      // console.log({ id, transcript, allTranscripts });
      router.push(`/editor?media=${id}&transcript=${transcript.id}`);
    },
    [router, allTranscripts],
  );

  return (
    <Root className={classes.root}>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main maxWidth="xl">
        {user && groups && (groups.includes('Editors') || groups.includes('Organisers')) ? (
          <MediaTable
            media={allMedia}
            onDeleteMedia={payload => console.log('onDeleteMedia', { payload })}
            onEditMedia={onEditMedia}
            onTranslateMedia={payload => console.log('onTranslateMedia', { payload })}
            onClickMedia={onClickMedia}
          />
        ) : user === null ? (
          'Access Denied!'
        ) : null}
      </Main>
    </Root>
  );
};

// export const getServerSideProps = async context => {
//   const { Auth, DataStore } = withSSRContext(context);

//   try {
//     const {
//       attributes: { sub: identityId },
//       signInUserSession: {
//         accessToken: {
//           payload: { 'cognito:groups': groups },
//         },
//       },
//     } = await Auth.currentAuthenticatedUser();

//     console.log(identityId, groups);

//     DataStore.configure({
//       syncExpressions: [
//         syncExpression(User, () => {
//           return user => user.identityId('eq', identityId);
//         }),
//       ],
//     });

//     const user = serializeModel(await DataStore.query(User, user => user.identityId('eq', identityId))).pop() ?? null;

//     return { props: { identityId, groups, user } };
//   } catch (error) {
//     console.error(error);
//     return { props: {} };
//   }
// };

export default DashboardPage;
