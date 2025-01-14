import type { EmotionCache } from '@emotion/react';
import type { AppType } from 'next/app';
import type { DocumentContext, DocumentInitialProps } from 'next/document';

import Document, { Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../src/createEmotionCache';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="dns-prefetch"
            href="https://www.plant-for-the-planet.org/"
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com/"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="image"
            href="/assets/images/project-contribution-default-landscape.png"
          />
          {/* Commented code below to avoid inserting emotion css <style> tags above global/module scss */}
          {/* <meta name="emotion-insertion-point" content="" /> */}
          {this.props.styles}
        </Head>
        <body style={{ overscrollBehavior: 'contain' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp:
        (App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>) =>
        (props) => {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: (
      <>
        {initialProps.styles}
        {emotionStyleTags}
      </>
    ),
  };
};

export default MyDocument;
