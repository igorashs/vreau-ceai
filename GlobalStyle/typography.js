import { css } from 'styled-components';

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
  }

  a {
    color: var(--accent-text-dark);
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: 500;
    line-height: 1.3;
    color: var(--text-dark);
  }

  h1 {
    font-size: var(--h1-font-size);
  }

  h2 {
    font-size: var(--h2-font-size);
  }

  h3 {
    font-size: var(--h3-font-size);
  }

  h4 {
    font-size: var(--h4-font-size);
  }

  h5 {
    font-size: var(--h5-font-size);
  }

  small {
    font-size: 0.75rem;
  }
`;
