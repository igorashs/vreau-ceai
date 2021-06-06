import withPageLayout from '@/layouts/Layout';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { SessionProvider } from 'contexts/SessionContext';
import { refreshUser } from 'services/ceaiApi';
import { useEffect, useState } from 'react';
import { CartProvider } from 'contexts/CartContext';
import dynamic from 'next/dynamic';
import GlobalStyle from 'GlobalStyle';
import { UserAuth, UserSession } from 'types';
import { validateSession } from 'lib/session';

const TopProgressBar = dynamic(() => import('@/shared/TopProgressBar'), {
  ssr: false,
});

type MyAppProps = AppProps & {
  initialSession: UserSession;
  Component: {
    withLayout?: (page: React.ReactNode) => React.ReactElement;
  };
};

export default function MyApp({
  Component,
  pageProps,
  initialSession,
}: MyAppProps) {
  const withLayout = Component.withLayout || withPageLayout;
  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    const refreshSession = async () => {
      const res = await refreshUser();

      if (res.success) {
        // update session
        setSession(res.session);
      }
    };

    if (initialSession.needRefresh) {
      refreshSession();
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
      <TopProgressBar />
      <SessionProvider session={session}>
        <CartProvider>{withLayout(<Component {...pageProps} />)}</CartProvider>
      </SessionProvider>
    </>
  );
}

type InitialProps = AppContext & {
  ctx: {
    req: {
      cookies?: { [key: string]: string | undefined };
    };
  };
};

MyApp.getInitialProps = async (appContext: InitialProps) => {
  const session: UserSession = {
    isAuth: false,
    user: null,
    needRefresh: false,
  };

  // we are on server side
  if (appContext.ctx.req && appContext.ctx.req.cookies) {
    const { access, refresh } = appContext.ctx.req.cookies;
    const { isAuth, claims } = validateSession<UserAuth>(access, refresh);

    session.isAuth = isAuth;
    session.user = claims;

    if (isAuth && !claims) session.needRefresh = true;
  }

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, initialSession: session };
};
