import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Amplify, { Auth, Hub, DataStore, Analytics, syncExpression } from 'aws-amplify';
import { CacheProvider } from '@emotion/react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

import { defaultTheme } from '@hyperaudio/common';

import createEmotionCache from './util/createEmotionCache';
import Topbar from './components/Topbar';

import awsexports from './aws-exports';
import awsconfig from './aws-config';

import { User } from './models';

// global.Amplify = Amplify;
global.Auth = Auth;

Amplify.configure({ ...awsexports, ...awsconfig });

Analytics.autoTrack('session', {
  enable: true,
  provider: 'AWSPinpoint',
});

Analytics.autoTrack('pageView', {
  enable: true,
  eventName: 'pageView',
  // OPTIONAL, by default is 'multiPageApp'
  // you need to change it to 'SPA' if your app is a single-page app like React
  type: 'SPA',
  provider: 'AWSPinpoint',
  getUrl: () => {
    return window.location.origin + window.location.pathname;
  },
});

Hub.listen('auth', async data => {
  if (data.payload.event === 'signOut') {
    // await DataStore.clear();
  }
});

const PREFIX = 'App';
const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  minHeight: '100%',
}));

const clientSideEmotionCache = createEmotionCache();

const getUser = async (setUser, identityId) => {
  DataStore.configure({
    syncExpressions: [
      syncExpression(User, () => {
        return user => user.identityId('eq', identityId);
      }),
    ],
  });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  setUser(Array.isArray(user) ? user[0] : user);
};

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [user, setUser] = useState();
  const [groups, setGroups] = useState([]);

  useEffect(
    () =>
      (async () => {
        try {
          const {
            attributes: { sub: identityId },
            signInUserSession: {
              idToken: { payload },
            },
          } = await Auth.currentAuthenticatedUser();
          // setUser(user);
          getUser(setUser, identityId);
          setGroups(payload['cognito:groups']);
        } catch (ignored) {}
      })(),
    [],
  );

  useEffect(() => {
    if (!user) return;

    const subscription = DataStore.observe(User).subscribe(() => getUser(setUser, user.identityId));
    return () => subscription.unsubscribe();
  }, [user]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={defaultTheme}>
        <Root className={classes.root}>
          <CssBaseline />
          <Topbar {...pageProps} user={user} groups={groups} />
          <Component {...pageProps} user={user} groups={groups} />
        </Root>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
