import { GlobalStyle } from 'GlobalStyle';
import { withLayout as withPageLayout } from '@layouts/Layout';

function MyApp({ Component, pageProps }) {
  const withLayout = Component.withLayout || withPageLayout;

  return (
    <>
      <GlobalStyle />
      {withLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
