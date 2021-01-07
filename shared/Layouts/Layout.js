import styled from 'styled-components';
import { Footer } from '../Footer';
import { Header } from '../Header';

const Wrapper = styled.div`
  min-height: calc(100vh - (var(--baseline) * 2));
`;

function Layout({ children }) {
  return (
    <>
      <Header />
      <Wrapper>{children}</Wrapper>
      <Footer />
    </>
  );
}

export const withLayout = (page) => <Layout>{page}</Layout>;
