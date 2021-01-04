import { createGlobalStyle } from 'styled-components';
import { variables } from './variables';
import { reset } from './reset';
import { typography } from './typography';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  ${variables}
  ${typography}

  body {
    background-color: var(--body-bg);
  }
`;
