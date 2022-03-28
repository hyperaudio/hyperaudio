import React, { useState, useCallback, useEffect, useReducer, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TextTruncate from 'react-text-truncate';
import _ from 'lodash';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { Main } from '../components';
import { Media, Channel } from '../models';

const PREFIX = `HomePage`;
const classes = {
  root: `${PREFIX}-Root`,
  thumbTitle: `${PREFIX}-thumbTitle`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.thumbTitle} span`]: {
    lineHeight: '1.44em !important',
  },
}));

const getMedia = async setAllMedia => setAllMedia(await DataStore.query(Media));
const getChannels = async setAllMedia => setAllMedia(await DataStore.query(Channel));

const HomePage = props => {
  const [allMedia, setAllMedia] = useState([]);
  const [allChannels, setAllChannels] = useState([]);

  console.log({ allMedia, allChannels });

  useEffect(() => {
    getMedia(setAllMedia);
    window.DataStore = DataStore;

    const subscription = DataStore.observe(Media).subscribe(msg => getMedia(setAllMedia));
    window.addEventListener('online', () => navigator.onLine && getMedia(setAllMedia));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getChannels(setAllChannels);

    const subscription = DataStore.observe(Channel).subscribe(msg => getChannels(setAllChannels));
    window.addEventListener('online', () => navigator.onLine && getChannels(setAllChannels));

    return () => subscription.unsubscribe();
  }, []);

  const displayChannels = useMemo(() => {
    const channelsWithMediaArrays = allChannels.map(channel => {
      // add all but private media to appropriate channels
      const media = _.filter(allMedia, o => o.channel?.id === channel.id && !o.private);
      return { ...channel, media };
    });
    const onlyChannelsWithAvailableMedia = _.filter(channelsWithMediaArrays, a => a.media.length > 0);
    return onlyChannelsWithAvailableMedia;
  }, [allChannels, allMedia]);

  // console.group('Home');
  // console.log({ allChannels, displayChannels });
  // console.groupEnd();

  const user = true;

  return (
    <Root className={classes.root}>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main maxWidth="xl">
        {user &&
          displayChannels.map(channel => {
            return [
              <Container maxWidth={false} key={channel.channelId}>
                <Grid container key={`g-${channel.channelId}`} spacing={{ xs: 4, md: 8 }}>
                  <Grid item xs={12} md={4} xl={4}>
                    <Typography variant="h5" component="h1" gutterBottom>
                      {channel.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {channel.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8} xl={8}>
                    <Grid container spacing={4}>
                      {channel.media.map(o => (
                        <MediaCard media={o} key={o.id} />
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Container>,
              <Divider key={`d-${channel.channelId}`} light sx={{ mt: 8, mb: 8 }} variant="fullWidth" />,
            ];
          })}
      </Main>
    </Root>
  );
};

const MediaCard = ({ media }) => {
  const router = useRouter();
  const openMedia = useCallback(() => router.push(`/media/${media.id}`), [router, media]);

  return (
    <Grid item xs={6} sm={4}>
      <Card sx={{ mb: 1 }}>
        <CardActionArea onClick={openMedia}>
          <CardMedia component="img" height="100%" image={media.poster} />
        </CardActionArea>
      </Card>
      <Tooltip title={media.title}>
        <Link
          color="primary"
          className={classes.thumbTitle}
          sx={{ cursor: 'pointer', display: 'block' }}
          underline="hover"
          variant="body2"
          onClick={openMedia}
        >
          <TextTruncate line={2} element="span" truncateText="…" text={media.title} />
        </Link>
      </Tooltip>
    </Grid>
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

export default HomePage;
