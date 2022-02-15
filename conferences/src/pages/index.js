import Head from 'next/head';
import React, { useState, useCallback, useEffect, useReducer } from 'react';
import TextTruncate from 'react-text-truncate';
import _ from 'lodash';
import { Auth, DataStore, syncExpression, withSSRContext } from 'aws-amplify';
import { serializeModel, deserializeModel } from '@aws-amplify/datastore/ssr';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import NoSsr from '@mui/material/NoSsr';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { MediaTable } from '@hyperaudio/common';

import { Main } from '../components';
import { User } from '../models';

const PREFIX = `HomePage`;
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

const HomePage = props => {
  console.log(props);

  const media = [
    {
      mediaId: 1,
      name: 'Podcasting has no future.',
      description: 'Dolor eiusmod quis non esse nulla quis amet ad nostrud non mollit quis culpa.',
      thumb: 'https://picsum.photos/400/225',
      created: '2002-04-02',
      modified: null,
      status: 'uploaded',
      isPublic: false,
      channelId: null,
    },
    {
      mediaId: 5,
      name: 'What’s next for online conferences?',
      description: 'Dolor eiusmod quis non esse nulla quis amet ad nostrud non mollit quis culpa.',
      thumb: 'https://picsum.photos/400/225',
      created: '2001-11-12',
      modified: '2011-02-27',
      status: 'corrected',
      isPublic: false,
      channelId: 1,
    },
    {
      mediaId: 20,
      name: 'The Future of Podcasting is Adaptive, Open and Data ethical',
      description: 'Dolor eiusmod quis non esse nulla quis amet ad nostrud non mollit quis culpa.',
      thumb: 'https://picsum.photos/400/225',
      created: '2001-06-13',
      modified: '2001-07-01',
      status: 'ready',
      isPublic: false,
      channelId: 0,
    },
  ];

  const channels = [
    {
      channelId: 0,
      name: 'Creative AI',
      description:
        'Can complex code be written creatively? Does art emerge from AI algorithms? How can we teach AI— or about AI—creatively? At MozFest you will have plenty of room to explore these questions in the Creative AI space! By fuelling a community that uses creativity to re-envision, question, and interact with AI and its effects on our daily lives, we will co-create a better future where humans and machines collaborate to unleash the best of us. Collaborative art making, hands-on learning, open studio sessions, critical reflection, forward facing discussions, web-native exhibitions and much more await you in the Creative AI space!',
    },
    {
      channelId: 1,
      name: 'AI Wellness',
      description:
        'AI Wellness is a transformative space changing artificial intelligence into authentic intelligence. This Space will channel community knowledge and experiences with technology to inform the future of human-centered AI that benefits society and individuals. If you are a dreamer, innovator, artist, technologist, storyteller, healer, or defender of healthy online communities, please join us. We invite you to contribute by sharing stories about how AI shapes our lives, by demystifying technology with understanding, and by creating community-centered solutions for healthier AI. Together, we will envision AI that promotes joy, healing, and wellbeing for all.',
    },
  ];

  const groups = channels.map(channel => {
    const items = _.filter(media, o => o.channelId === channel.channelId);
    return { ...channel, media: items };
  });
  // const channels = [];

  const user = true;
  // const user = false;

  return (
    <Root className={classes.root}>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {/* If logged in */}
        {user && (
          <MediaTable
            media={media}
            onDeleteMedia={payload => console.log('onDeleteMedia', { payload })}
            onEditMedia={payload => console.log('onEditMedia', { payload })}
            onTranslateMedia={payload => console.log('onTranslateMedia', { payload })}
          />
        )}
      </Main>

      <Main>
        {/* If logged out */}
        {user &&
          groups.map(group => {
            return [
              <Container maxWidth={false} key={group.channelId}>
                <Grid container key={`g-${group.channelId}`} spacing={{ xs: 4, md: 8 }}>
                  <Grid item xs={12} md={4} xl={4}>
                    <Typography variant="h5" component="h1" gutterBottom>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {group.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8} xl={8}>
                    <Grid container spacing={4}>
                      {group.media.map(media => {
                        return (
                          <Grid item key={media.mediaId} xs={6} sm={4}>
                            <Card sx={{ mb: 1 }}>
                              <CardActionArea onClick={() => console.log('onMediaOpen', media.mediaId)}>
                                <CardMedia component="img" height="100%" image={media.thumb} />
                              </CardActionArea>
                            </Card>
                            <Tooltip title={media.name}>
                              <Link
                                color="primary"
                                className={classes.thumbTitle}
                                sx={{ cursor: 'pointer', display: 'block' }}
                                underline="hover"
                                variant="body2"
                                onClick={() => console.log('onMediaOpen', media.mediaId)}
                              >
                                <TextTruncate line={2} element="span" truncateText="…" text={media.name} />
                              </Link>
                            </Tooltip>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Container>,
              <Divider key={`d-${group.channelId}`} light sx={{ mt: 8, mb: 8 }} variant="fullWidth" />,
            ];
          })}
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

export default HomePage;
