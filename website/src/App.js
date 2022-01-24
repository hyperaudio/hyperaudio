import React from 'react';
import PropTypes from 'prop-types';

// import Amplify, { Hub, Analytics } from 'aws-amplify';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import createEmotionCache from './util/createEmotionCache';
import lightTheme from './styles/theme/lightTheme';

// import awsexports from './aws-exports';
// import awsconfig from './aws-config';

// Amplify.configure({ ...awsexports, ...awsconfig });
// Analytics.record();

// Hub.listen('auth', async data => {
//   if (data.payload.event === 'signOut') {
//     await DataStore.clear();
//   }
// });

const clientSideEmotionCache = createEmotionCache();

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {/* <Header /> */}
        <Component {...pageProps} />
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
