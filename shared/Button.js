import styled, { css } from 'styled-components';

const buttonStyle = css`
  padding: calc(var(--baseline) / 4) calc(var(--baseline) / 2);
  border-radius: 4px;
  border: 0;
  color: var(--text-light);
  background-color: var(--accent-dark);
  box-shadow: 1px 1px 2px #00000066;
  cursor: pointer;

  :hover {
    background-color: var(--accent);
  }
`;

export const ButtonLink = styled.a`
  text-decoration: none;
  ${buttonStyle}
`;

export const Button = styled.button`
  ${buttonStyle}
`;
