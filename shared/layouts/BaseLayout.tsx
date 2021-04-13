import styled from 'styled-components';
import breakpoints from 'GlobalStyle/breakpoints';
import withLayout from './Layout';
import Container from '../Container';

const Wrapper = styled.div`
  padding-top: var(--baseline);

  @media (min-width: ${breakpoints.lg}) {
    padding-top: calc(var(--baseline) * 2);
  }
`;

const BaseLayout: React.FC = ({ children }) => {
  return (
    <>
      <Wrapper>
        <Container>
          <main>{children}</main>
        </Container>
      </Wrapper>
    </>
  );
};

const withBaseLayout: (page: React.ReactNode) => React.ReactElement = (page) =>
  withLayout(<BaseLayout>{page}</BaseLayout>);

export default withBaseLayout;
