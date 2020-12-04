/* eslint-disable react/jsx-props-no-spreading */
import 'reflect-metadata'; // FIXME: still need this?

import App from 'next/app';
import Amplify from 'aws-amplify';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import awsconfig from './aws-exports';
import theme from './theme';

Amplify.configure(awsconfig);

export default class Application extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
