import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Amplify, { Auth, Hub, DataStore, Analytics, syncExpression } from 'aws-amplify';
import { CacheProvider } from '@emotion/react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

import { getTheme } from '@hyperaudio/common';

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

const inputGlobalStyles = (
  <GlobalStyles
    styles={`
      html, body {
        background: white;
        min-height: 100%;
      }
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter/Inter-Regular.woff2') format('woff');
        font-style: normal;
        font-weight: 400;
        font-display: optional;
      }
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter/Inter-Medium.woff2') format('woff2');
        font-style: normal;
        font-weight: 500;
        font-display: optional;
      }
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter/Inter-SemiBold.woff2') format('woff');
        font-style: normal;
        font-weight: 600;
        font-display: optional;
      }
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter/Inter-Bold.woff2') format('woff');
        font-style: normal;
        font-weight: 700;
        font-display: optional;
      }
      @font-face {
        font-family: 'Quicksand';
        src: url('/fonts/inter/Quicksand_Bold.woff') format('woff');
        font-style: normal;
        font-weight: 700;
        font-display: optional;
      }
`}
  />
);

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
      <CssBaseline />
      <ThemeProvider theme={getTheme({ typography: 'fixed' })}>
        <Root className={classes.root}>
          {inputGlobalStyles}
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
