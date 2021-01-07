import styled from 'styled-components';
import { withLayout } from './Layout';
import { Container } from '../Container';
import breakpoints from '../../GlobalStyle/breakpoints';

const Wrapper = styled.div`
  padding-top: var(--baseline);

  @media (min-width: ${breakpoints.lg}) {
    padding-top: calc(var(--baseline) * 2);
  }
`;

function BaseLayout({ children }) {
  return (
    <>
      <Wrapper>
        <Container>
          <main>{children}</main>
        </Container>
      </Wrapper>
    </>
  );
}

export const withBaseLayout = (component) =>
  withLayout(<BaseLayout>{component}</BaseLayout>);
