import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Amplify, { Auth, Hub, Storage, DataStore, Analytics, syncExpression, AuthModeStrategyType } from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import { CacheProvider } from '@emotion/react';
import PlausibleProvider from 'next-plausible';
import { usePlausible } from 'next-plausible';

import Alert from '@mui/material/Alert';
import GlobalStyles from '@mui/material/GlobalStyles';
import Link from '@mui/material/Link';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

import { getTheme } from '@hyperaudio/common';

import createEmotionCache from './util/createEmotionCache';
import Topbar from './components/Topbar';

import awsexports from './aws-exports';
import awsconfig from './aws-config';

import { User } from './models';

// global.Amplify = Amplify;
global.Auth = Auth;
global.DataStore = DataStore;

Amplify.configure({ ...awsexports, ...awsconfig });
try {
  Amplify.addPluggable(new AmazonAIPredictionsProvider());
} catch (ignored) {}

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

Storage.configure({ track: true });

// Hub.listen('auth', async data => {
//   if (data.payload.event === 'signOut') {
//     // await DataStore.clear();
//   }
// });

DataStore.configure({
  fullSyncInterval: 60, // minutes
  authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
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
`}
  />
);

const getUser = async (setUser, identityId) => {
  // DataStore.configure({
  //   syncExpressions: [
  //     syncExpression(User, () => {
  //       return user => user.identityId('eq', identityId);
  //     }),
  //   ],
  // });

  const user = await DataStore.query(User, user => user.identityId('eq', identityId), { limit: 1 });
  setUser(Array.isArray(user) ? user[0] : user ?? null);
};

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const plausible = usePlausible();
  const [user, setUser] = useState();
  const [groups, setGroups] = useState([]);
  const [domain, setDomain] = useState(global?.location?.hostname);
  const [supportsIndexedDB, setSupportsIndexedDB] = useState(true);

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
          getUser(setUser, identityId);
          setGroups(payload?.['cognito:groups'] ?? []);
        } catch (ignored) {
          setUser(null);
        }
      })(),
    [],
  );

  useEffect(() => {
    if (!user) return;

    const subscription = DataStore.observe(User).subscribe(() => getUser(setUser, user.identityId));
    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    Hub.listen('auth', async data => {
      console.log({ data });
      if (data.payload.event === 'signOut') {
        // await DataStore.clear();
        setUser(null);
        plausible('signOut');
      }

      if (data.payload.event === 'signIn') {
        try {
          const {
            attributes: { sub: identityId },
            signInUserSession: {
              idToken: { payload },
            },
          } = data.payload.data;
          getUser(setUser, identityId);
          setGroups(payload?.['cognito:groups'] ?? []);
        } catch (ignored) {
          setUser(null);
        }
        plausible('signIn');
      }
    });
  }, [plausible]);

  useEffect(() => setDomain(window.location.hostname), []);

  useEffect(() => {
    try {
      const db = window.indexedDB.open('test');
      db.onerror = error => {
        console.error(error);
        setSupportsIndexedDB(false);
      };
    } catch (error) {
      console.error(error);
      setSupportsIndexedDB(false);
    }
  }, []);

  const organisation = useMemo(
    () => ({
      name: 'MozFest 2022',
    }),
    [],
  );

  return (
    <CacheProvider value={emotionCache}>
      <CssBaseline />
      <ThemeProvider theme={getTheme({ typography: 'fixed' })}>
        <PlausibleProvider domain={domain}>
          <Root className={classes.root}>
            {inputGlobalStyles}
            <Topbar {...pageProps} user={user} groups={groups} organisation={organisation} />
            {!supportsIndexedDB ? (
              <Alert severity="error">
                <Link href="https://bugzilla.mozilla.org/show_bug.cgi?id=1639542">
                  Firefox does not yet support a technology called IndexDB in Private Mode
                </Link>
                . Since Hyperaudio relies on IndexDB, we are unfortunately unable to support Hyperaudio in Firefox's
                private mode at this time.
              </Alert>
            ) : null}
            <Component {...pageProps} user={user} groups={groups} organisation={organisation} />
          </Root>
        </PlausibleProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

global.MUX_KEY = process.env.NEXT_PUBLIC_MUX_KEY;

export default App;

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
