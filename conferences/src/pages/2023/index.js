import Head from 'next/head';
import React, { useState, useCallback, useEffect, useReducer, useMemo } from 'react';
import _ from 'lodash';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { HyperaudioIcon } from '@hyperaudio/common';

import CardGrid from '../../components/organisms/CardGrid';
import { Media, Channel } from '../../models';

const PREFIX = `HomePage`;
const classes = {
  hero: `${PREFIX}-hero`,
  heroOrnament: `${PREFIX}-heroOrnament`,
  heroTitle: `${PREFIX}-heroTitle`,
  root: `${PREFIX}-Root`,
};

const Root = styled(Box)(({ theme }) => ({
  [`& .${classes.hero}`]: {
    background: theme.palette.primary.main,
    backgroundImage: `linear-gradient(to bottom right, ${theme.palette.secondary.light} -50%, ${theme.palette.primary.dark} 150%)`,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: '33vh',
    overflow: 'hidden',
    paddingTop: theme.spacing(12),
    position: 'relative',
  },
  [`& .${classes.heroTitle}`]: {
    fontSize: '80px',
    fontWeight: '300',
    lineHeight: '0.85em',
    position: 'relative',
    top: '0.088em',
    [theme.breakpoints.up('sm')]: {
      fontSize: '130px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '210px',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '260px',
    },
  },
  [`& .${classes.heroOrnament}`]: {
    fontSize: '1000px',
    left: '33%',
    opacity: 0.1,
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-33%, -33%) rotate(22deg)',
    [theme.breakpoints.up('sm')]: {
      left: '50%',
      fontSize: '1500px',
      top: '11%',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2000px',
      top: '-11%',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '2500px',
      top: '-22%',
    },
    [theme.breakpoints.up('xl')]: {
      top: '-33%',
      fontSize: '3000px',
    },
  },
}));

const getMedia = async setAllMedia => setAllMedia(await DataStore.query(Media));
const getChannels = async setAllMedia => setAllMedia(await DataStore.query(Channel));

const HomePage = props => {
  const { user, groups, organisation } = props;
  const [allMedia, setAllMedia] = useState([]);
  const [allChannels, setAllChannels] = useState([]);

  // console.log({ allMedia, allChannels });

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
    const channelsWithMediaArrays = allChannels
      .map(channel => {
        // add all but private media to appropriate channels
        const media = _.filter(allMedia, o => o.channel?.id === channel.id && !o.private);
        return { ...channel, media };
      })
      .map(channel => {
        channel.media.push({
          id: 'TEST',
          playbackId: 'TEST',
          url: '',
          poster: 'https://picsum.photos/seed/picsum/720/360',
          title: 'Lorem Ipsum',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet dolor gravida leo placerat, a sollicitudin felis imperdiet. Fusce molestie neque ante, sit amet dictum dolor ultricies vitae. Vestibulum vitae eros in risus viverra consectetur molestie quis neque. Nullam aliquam rutrum vulputate.',
          language: 'en-GB',
          tags: [],
          private: false,
          status: {
            label: 'transcribed',
          },
          metadata: null,
          createdAt: '2022-04-04T16:32:29.067Z',
          updatedAt: '2022-04-04T16:32:29.067Z',
          mediaChannelId: '9de00246-5a4e-4986-81b6-109e1e22c5a3',
          owner: null,
          _version: 1,
          _lastChangedAt: 1649089949070,
          _deleted: null,
          channel: {
            id: '9de00246-5a4e-4986-81b6-109e1e22c5a3',
            name: 'Emergent Sessions',
            description:
              "Sometimes you come up with a great idea for a session during the festival. Here's your chance to connect with others based on a spontaneous thought, a shared interest, a creative spark, a question or whatever else that inspires you!",
            tags: [],
            metadata: null,
            createdAt: '2022-03-25T11:11:48.854Z',
            updatedAt: '2022-03-28T10:52:53.354Z',
            owner: null,
            _version: 2,
            _lastChangedAt: 1648464773395,
            _deleted: null,
          },
        });
        return channel;
      });

    const onlyChannelsWithAvailableMedia = _.filter(channelsWithMediaArrays, a => a.media.length > 0);
    return onlyChannelsWithAvailableMedia.filter(({ createdAt }) => createdAt.startsWith('2023-'));
  }, [allChannels, allMedia]);

  console.group('Home');
  console.log({ allChannels, displayChannels });
  console.groupEnd();

  return (
    <>
      <Head>
        <title>Home • {organisation.name} @ hyper.audio</title>
      </Head>
      <Root className={classes.root}>
        <Box className={classes.hero}>
          <Container maxWidth="xl">
            <Typography variant="h1" className={classes.heroTitle}>
              {organisation.name}
            </Typography>
          </Container>
          <HyperaudioIcon className={classes.heroOrnament} />
        </Box>
        {displayChannels.map(channel => (
          <Container
            key={channel.id}
            maxWidth="xl"
            sx={{ mt: { xs: '1px' }, mb: { xs: 3, sm: 3 }, my: { md: 4, lg: 12, xl: 16 } }}
          >
            <CardGrid title={channel.name} text={channel.description} items={channel.media} disableLinks={!user} />
          </Container>
        ))}
      </Root>
    </>
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
