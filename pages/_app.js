import { GlobalStyle } from 'GlobalStyle';
import { withLayout as withPageLayout } from '@/layouts/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const withLayout = Component.withLayout || withPageLayout;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <GlobalStyle />
      {withLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
