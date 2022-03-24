import React from 'react';
import PropTypes from 'prop-types';
import Amplify, { Hub, DataStore, Analytics } from 'aws-amplify';
import { CacheProvider } from '@emotion/react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

import { defaultTheme } from '@hyperaudio/common';

import createEmotionCache from './util/createEmotionCache';
import Topbar from './components/Topbar';

import awsexports from './aws-exports';
import awsconfig from './aws-config';

// global.Amplify = Amplify;

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
    await DataStore.clear();
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

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={defaultTheme}>
        <Root className={classes.root}>
          <CssBaseline />
          <Topbar {...pageProps} />
          <Component {...pageProps} />
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
