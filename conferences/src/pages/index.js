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
import { styled, useTheme } from '@mui/material/styles';

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

  //  const channels = appData.channels.map(channel => {
  //    const media = _.filter(appData.media, o => o.channelId === channel.channelId);
  //    return { ...channel, media };
  //  });
  const channels = [];

  return (
    <Root className={classes.root}>
      <Head>
        <title>Hyperaudio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1>Hyperaudio</h1>

        {channels.map(channel => {
          return [
            <Container maxWidth={false} key={channel.channelId}>
              <Grid container key={`g-${channel.channelId}`} spacing={{ xs: 4, md: 8 }}>
                <Grid item xs={12} md={4} xl={3}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    {channel.name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {channel.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} xl={9}>
                  <Grid container spacing={4}>
                    {channel.media.map(media => {
                      return (
                        <Grid item key={media.mediaId} lg={3} md={4} sm={4} xl={2} xs={6}>
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
            <Divider key={`d-${channel.channelId}`} light sx={{ mt: 8, mb: 8 }} variant="fullWidth" />,
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
