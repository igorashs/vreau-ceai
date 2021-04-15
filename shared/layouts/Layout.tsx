import styled from 'styled-components';
import Footer from '../Footer';
import Header from '../Header';

const Wrapper = styled.div`
  min-height: calc(100vh - (var(--baseline) * 2));
`;

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <Wrapper>{children}</Wrapper>
      <Footer />
    </>
  );
};

const withLayout: (page: React.ReactNode) => React.ReactElement = (page) => (
  <Layout>{page}</Layout>
);

export default withLayout;
