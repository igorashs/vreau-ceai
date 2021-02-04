import { GlobalStyle } from 'GlobalStyle';
import { withLayout as withPageLayout } from '@/layouts/Layout';
import Head from 'next/head';
import App from 'next/app';
import { SessionProvider } from 'contexts/SessionContext';
import { verifyToken } from 'lib/session';
import { refreshUser } from 'services/ceaiApi';
import { useEffect, useState } from 'react';
import { CartProvider } from 'contexts/CartContext';

function MyApp({ Component, pageProps, initialSession }) {
  const withLayout = Component.withLayout || withPageLayout;
  const [session, setSession] = useState(initialSession);

  useEffect(async () => {
    if (initialSession.needRefresh) {
      const res = await refreshUser();

      if (res.success) {
        // update session
        setSession(res.session);
      }
    }
  }, []);

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
        <CartProvider>{withLayout(<Component {...pageProps} />)}</CartProvider>
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  let session = { isAuth: false, user: null, needRefresh: false };

  if (appContext.ctx.req && appContext.ctx.req.cookies) {
    const { access, refresh } = appContext.ctx.req.cookies;

    if (refresh) {
      const refreshClaims = verifyToken(refresh);

      if (refreshClaims) {
        const accessClaims = verifyToken(access);
        session.isAuth = true;

        if (accessClaims) {
          session.user = accessClaims;
        } else {
          session.needRefresh = true;
        }
      } else {
        session.needRefresh = true;
      }
    }
  }

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, initialSession: session };
};

export default MyApp;
