import styled, { css } from 'styled-components';

export const buttonStyle = css`
  padding: calc(var(--baseline) / 4) calc(var(--baseline) / 2);
  border-radius: 4px;
  border: 0;
  color: var(--text-light);
  background-color: var(--accent-dark);
  box-shadow: 1px 1px 2px #00000066;
  text-transform: lowercase;
  text-decoration: none;

  cursor: pointer;

  :hover {
    background-color: var(--accent);
  }
`;

const noneStyle = css`
  background-color: transparent;
  box-shadow: none;

  :hover {
    background-color: #0000001a;
  }
`;

const dangerStyle = css`
  background-color: var(--danger-dark);

  :hover {
    background-color: var(--danger);
  }
`;

const textStyle = css`
  background-color: transparent;
  text-transform: initial;
  box-shadow: none;

  :hover {
    background-color: transparent;
    filter: brightness(0.7);
  }
`;

const dangerTextStyle = css`
  ${textStyle}
  color: var(--text-danger-light);
`;

const accentTextStyle = css`
  ${textStyle}
  color: var(--accent-text-dark);
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;

  ${buttonStyle}

  ${({ btnStyle }) => {
    switch (btnStyle) {
      case 'danger':
        return dangerStyle;
      case 'none':
        return noneStyle;
      case 'danger-text':
        return dangerTextStyle;
      case 'accent-text':
        return accentTextStyle;
      default:
        return null;
    }
  }}

  ${({ icon }) => icon && 'padding: 4px; box-shadow: none;'}

  ${({ noPadding }) => noPadding && 'padding: 0;'}
`;
