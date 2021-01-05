import styled, { css } from 'styled-components';

const defaultStyle = css`
  color: var(--text-light);
  background-color: transparent;

  :hover {
    background-color: #0000001a;
  }
`;

const accentStyle = css`
  color: var(--text-light);
  background-color: var(--accent-dark);

  :hover {
    background-color: var(--accent);
  }
`;

const dangerStyle = css`
  color: var(--text-light);
  background-color: var(--danger-dark);

  :hover {
    background-color: var(--danger);
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  border-radius: 4px;
  cursor: pointer;

  ${({ btnStyle }) => {
    switch (btnStyle) {
      case 'accent':
        return accentStyle;
      case 'danger':
        return dangerStyle;
      default:
        return defaultStyle;
    }
  }}

  ${({ noPadding }) => noPadding && 'padding: 0;'}
`;
