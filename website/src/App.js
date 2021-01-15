/* eslint-disable react/jsx-props-no-spreading */
// import 'reflect-metadata'; // FIXME: still need this?
import App from 'next/app';
import dynamic from 'next/dynamic';
import Amplify from 'aws-amplify';
import Analytics from '@aws-amplify/analytics';

import 'nprogress/nprogress.css';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import lightTheme from 'src/themes/lightTheme';

import awsconfig from './aws-config';
import awsexports from './aws-exports';

global.Amplify = Amplify;

Amplify.configure({ ...awsexports, ...awsconfig });

Analytics.autoTrack('session', {
  enable: true,
});

Analytics.autoTrack('pageView', {
  enable: true,
  // OPTIONAL, by default is 'multiPageApp'
  // you need to change it to 'SPA' if your app is a single-page app like React
  type: 'SPA',
});

const TopProgressBar = dynamic(() => import('./components/TopProgressBar'), { ssr: false });

class Application extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <TopProgressBar />
        <style>
          {`#nprogress .bar {
              background-color: ${lightTheme.palette.primary.main};
              z-index: 10000;
              height: 5px;
            }
            #nprogress .peg { box-shadow: none; }
            html, body {
              height: 100%;
            }
            #__next {
              display: flex;
              flex-direction: column;
              height: 100%;
            }
            `}
        </style>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default Application;
