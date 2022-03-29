import * as React from 'react';
import Head from 'next/head';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { getTheme } from '@hyperaudio/common';

import Footer from '../components/Footer';
import Topbar from '../components/Topbar';
import createEmotionCache from '../lib/createEmotionCache';
import { config } from '../config';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

const PREFIX = `App`;
const classes = {
  bottom: `${PREFIX}-bottom`,
  main: `${PREFIX}-main`,
  root: `${PREFIX}-root`,
  top: `${PREFIX}-top`,
};

const Root = styled('div', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(() => ({
  backgroundImage: `linear-gradient(to top right, ${grey[300]}, ${grey[50]})`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '100vh',
  position: 'relative',
}));

const inputGlobalStyles = (
  <GlobalStyles
    styles={`
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

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [yOffset, setYOffset] = useState(0);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{config.title}</title>

        <link rel="canonical" href={config.url} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <meta name="author" content="Hyperaudio — https://hyper.audio" />
        <meta name="charset" content="utf-8" />
        <meta name="coverage" content="Worldwide" />
        <meta name="description" content={config.description} />
        <meta name="designer" content="Hyperaudio — https://hyper.audio" />
        <meta name="distribution" content="Global" />
        <meta name="google" content="nositelinkssearchbox" />
        <meta name="keywords" content={config.keywords} />
        <meta name="language" content="en" />
        <meta name="rating" content="General" />
        <meta name="revist-after" content="after 1 days" />
        <meta name="robots" content="index,follow" />
        <meta name="title" content={config.title} />
        <meta name="monetization" content="$ilp.uphold.com/3h66mKZLrgQZ" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale = 1.0, initial-scale = 1.0, maximum-scale = 1.0, user-scalable=no, shrink-to-fit=no"
        />

        {/* twitter metadata */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@hyperaudio" />

        {/* og metadata */}
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content="/images/cover.png" />
        <meta property="og:image:alt" content={config.title} />
        <meta property="og:image:height" content="627" />
        <meta property="og:image:secure_url" content="/images/cover.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:title" content={config.title} />
        <meta property="og:url" content={config.url} />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={getTheme({ typography: 'responsive' })}>
        <Root className={`${classes.root} useGrain`}>
          <div className={classes.top}>
            <Topbar setOffset={setYOffset} />
            <main className={classes.main}>
              <Component {...pageProps} yOffset={yOffset} />
            </main>
          </div>
          <div className={classes.bottom}>
            {inputGlobalStyles}
            <Footer />
            {/* <Navbar /> */}
          </div>
        </Root>
      </ThemeProvider>
    </CacheProvider>
  );
}
