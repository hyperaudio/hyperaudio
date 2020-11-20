/* eslint-disable react/jsx-props-no-spreading */
import 'reflect-metadata';
import App from 'next/app';
import { Provider } from 'next-auth/client';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';

export default class Application extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    );
  }
}
