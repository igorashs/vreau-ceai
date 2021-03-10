import { createGlobalStyle } from 'styled-components';
import variables from './variables';
import reset from './reset';
import typography from './typography';
import nprogress from './nprogress';

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${variables}
  ${typography}
  ${nprogress}

  body {
    background-color: var(--body-bg);
  }

  :disabled {
    background-color: var(--disabled) !important;
    cursor: initial !important;
  }
`;

export default GlobalStyle;
