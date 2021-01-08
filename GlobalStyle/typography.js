import { css } from 'styled-components';
import breakpoints from './breakpoints';

export const typography = css`
  /* base font */
  html {
    font-size: var(--body-text);
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    line-height: var(--body-line-height);
    color: var(--text-dark);
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
    font-size: 1rem;
    text-transform: lowercase;
  }

  a {
    color: var(--accent-text-dark);
  }

  h1,
  h2,
  h3 {
    font-weight: 500;
    line-height: 1.3;
    color: var(--text-dark);
  }

  h1 {
    font-size: 2.369rem;
  }

  h2 {
    font-size: 1.777rem;
  }

  h3 {
    font-size: 1.333rem;
  }

  small {
    font-size: 0.75rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    h1 {
      font-size: 3.157rem;
    }

    h2 {
      font-size: 2.369rem;
    }
  }
`;
