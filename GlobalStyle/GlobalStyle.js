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


  :focus {
    outline: 0;
    box-shadow: 0px 2px 0px -1px var(--accent-text-light);
  }

  :disabled {
    background-color: var(--disabled) !important;
  }
`;
