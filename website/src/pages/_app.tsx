import Head from 'next/head';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { lightTheme } from '@hyperaudio/common';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';
import createEmotionCache from '../lib/createEmotionCache';

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

const globalStyles = `
  // @font-face {
  //   font-family: 'Cera Round Pro';
  //   src: url('/fonts/CeraRoundPro/Cera-Round-Pro-Regular.woff') format('woff');
  //   font-style: normal;
  //   font-weight: 400;
  //   font-display: swap;
  // }
  // @font-face {
  //   font-family: 'Cera Round Pro';
  //   src: url('/fonts/CeraRoundPro/Cera-Round-Pro-Medium.woff') format('woff');
  //   font-style: normal;
  //   font-weight: 500;
  //   font-display: swap;
  // }
  // @font-face {
  //   font-family: 'Cera Round Pro';
  //   src: url('/fonts/CeraRoundPro/Cera-Round-Pro-Bold.woff') format('woff');
  //   font-style: normal;
  //   font-weight: 600;
  //   font-display: swap;
  // }
  // @font-face {
  //   font-family: 'Cera Round Pro';
  //   src: url('/fonts/CeraRoundPro/Cera-Round-Pro-Black.woff') format('woff');
  //   font-style: normal;
  //   font-weight: 700;
  //   font-display: swap;
  // }
`;

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [yOffset, setYOffset] = useState(0);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Hyperaudio Site</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Root className={`${classes.root} useGrain`}>
          <div className={classes.top}>
            <Topbar setOffset={setYOffset} />
            <main className={classes.main}>
              <Component {...pageProps} yOffset={yOffset} />
            </main>
          </div>
          <div className={classes.bottom}>
            <GlobalStyles styles={globalStyles} />
            <Footer />
            {/* <Navbar /> */}
          </div>
        </Root>
      </ThemeProvider>
    </CacheProvider>
  );
}
