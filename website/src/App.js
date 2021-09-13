/* eslint-disable react/jsx-props-no-spreading */
// import 'reflect-metadata'; // FIXME: still need this?
import App from 'next/app';
import Amplify, { Analytics } from 'aws-amplify';

import { ThemeProvider } from '@material-ui/core/styles';

import useTheme from 'src/hooks/useTheme';

import awsexports from './aws-exports';
import awsconfig from './aws-config';

global.Amplify = Amplify;

Amplify.configure({ ...awsexports, ...awsconfig });
// Analytics.record();

const Provider = props => {
  const theme = useTheme();
  return <ThemeProvider {...props} theme={theme} />;
};

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
