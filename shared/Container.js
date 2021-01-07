import styled from 'styled-components';
import breakpoints from '../GlobalStyle/breakpoints';

export const Container = styled.div`
  /* mobile first */
  @media (min-width: ${breakpoints.sm}) {
    width: 540px;
    max-width: 540px;
    margin: 0 auto;
  }

  @media (min-width: ${breakpoints.md}) {
    width: 720px;
    max-width: 720px;
  }

  @media (min-width: ${breakpoints.lg}) {
    width: 960px;
    max-width: 960px;
  }

  @media (min-width: ${breakpoints.xl}) {
    width: 1140px;
    max-width: 1140px;
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    padding: 0 15px;
  }
`;
