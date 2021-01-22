import styled, { css } from 'styled-components';
import ArrowSvg from 'assets/icons/arrow.svg';
import { Button } from './Button';
import { useState } from 'react';

const itemStyle = css`
  padding: calc(var(--baseline) / 4) 0;
  border-bottom: 1px solid var(--layout);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${itemStyle}

  p {
    font-weight: 500;
  }

  button {
    transform: rotate(-90deg);
  }

  ${({ hide }) => hide && 'button {transform: rotate(90deg);}'}
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;

  li {
    ${itemStyle}
  }

  ${({ hide }) => hide && 'display: none;'}
`;

export function DropDownList({ label, children }) {
  const [hide, setHide] = useState(false);

  return (
    <div>
      <Header hide={hide}>
        <p>{label}</p>
        <Button icon onClick={() => setHide((e) => !e)} noPadding>
          <ArrowSvg />
        </Button>
      </Header>
      <List hide={hide}>{children}</List>
    </div>
  );
}
