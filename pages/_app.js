import { GlobalStyle } from 'GlobalStyle';
import { withLayout as withPageLayout } from '@/layouts/Layout';
import Head from 'next/head';
import App from 'next/app';
import { SessionProvider } from 'contexts/SessionContext';
import { verifySession } from 'lib/session';

function MyApp({ Component, pageProps, session }) {
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
      <SessionProvider session={session}>
        {withLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  let session = {};

  if (appContext.ctx.req) {
    session = verifySession(appContext.ctx.req);
  }

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, session };
};

export default MyApp;
