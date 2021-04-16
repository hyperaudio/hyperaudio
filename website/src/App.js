/* eslint-disable react/jsx-props-no-spreading */
// import 'reflect-metadata'; // FIXME: still need this?
import App from 'next/app';
import Amplify from 'aws-amplify';
import Analytics from '@aws-amplify/analytics';

import Provider from 'src/components/Provider';

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

class Application extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default Application;
