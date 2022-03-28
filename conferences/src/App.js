import React from 'react';
import PropTypes from 'prop-types';
import Amplify, { Hub, DataStore, Analytics } from 'aws-amplify';
import { CacheProvider } from '@emotion/react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

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

const inputGlobalStyles = (
  <GlobalStyles
    styles={`
      html, body {
        background: white;
        min-height: 100%;
      }
      @font-face {
        font-family: 'Manrope';
        src: url('/fonts/inter/Inter-Regular.woff2') format('woff2');
        font-style: normal;
        font-weight: 400;
        font-display: optional;
      }
      @font-face {
        font-family: 'Manrope';
        src: url('/fonts/inter/Inter-Medium.woff2') format('woff2');
        font-style: normal;
        font-weight: 500;
        font-display: optional;
      }
      @font-face {
        font-family: 'Manrope';
        src: url('/fonts/inter/Inter-Bold.woff2') format('woff2');
        font-style: normal;
        font-weight: 600;
        font-display: optional;
      }
      @font-face {
        font-family: 'Manrope';
        src: url('/fonts/inter/Inter-Black.woff2') format('woff2');
        font-style: normal;
        font-weight: 700;
        font-display: optional;
      }
`}
  />
);

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <Root className={classes.root}>
          <CssBaseline />
          {inputGlobalStyles}
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
