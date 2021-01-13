import { css } from 'styled-components';

export const buttonStyle = css`
  padding: calc(var(--baseline) / 4) calc(var(--baseline) / 2);
  border-radius: 4px;
  border: 0;
  color: var(--text-light);
  background-color: var(--accent-dark);
  box-shadow: 1px 1px 2px #00000066;
  text-transform: lowercase;

  cursor: pointer;

  :hover {
    background-color: var(--accent);
  }
`;
