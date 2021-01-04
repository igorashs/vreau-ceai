import { css } from 'styled-components';

export const variables = css`
  :root {
    /* colors */
    --body-bg: #f2f2f2;
    --accent: #166934;
    --accent-dark: #12542a;
    --layout: #666;
    --layout-dark: #404040;
    --layout-light: #f2f2f2;
    --layout-overlay: #000000bf;
    --disabled: #527a60;
    --input: #e4e4e4;
    --text-light: #f2f2f2;
    --text-dark: #404040;
    --accent-text-light: #92e8b1;
    --accent-text-dark: #12542a;

    /* typography */
    --body-text: 16px;
    --body-line-height: 1.75;
    --baseline: calc(var(--body-text) * var(--body-line-height));
  }
`;
