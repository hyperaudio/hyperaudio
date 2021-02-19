/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

class Doc extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="monetization" content="$ilp.uphold.com/3h66mKZLrgQZ" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Roboto&display=swap"
            rel="stylesheet"
          />
          <link rel="stylesheet" href="/ha-lite/css/hyperaudio-lite-player.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.5.0/velocity.js"> </script>
          <script src="https://platform.twitter.com/widgets.js"> </script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/ha-lite/js/hyperaudio-lite.js"> </script>
          <script src="/ha-lite/js/share-this.js"> </script>
          <script src="/ha-lite/js/share-this-twitter.js"> </script>
        </body>
      </Html>
    );
  }
}

Doc.getInitialProps = async ctx => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};

export default Doc;

// <meta name="referrer" content="same-origin" />
