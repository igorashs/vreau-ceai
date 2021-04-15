import styled, { css } from 'styled-components';
import ArrowSvg from 'assets/icons/arrow.svg';
import { useState } from 'react';
import Button from './Button';

const itemStyle = css`
  padding: calc(var(--baseline) / 4) 0;
  border-bottom: 1px solid var(--layout);
`;

type HideStyledProps = {
  hide?: boolean;
};

const Header = styled.div<HideStyledProps>`
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

const List = styled.ul<HideStyledProps>`
  display: grid;
  column-gap: var(--baseline);
  grid-template-columns: repeat(auto-fit, minmax(224px, 1fr));

  li {
    ${itemStyle}
  }

  ${({ hide }) => hide && 'display: none;'}
`;

type DropDownListProps = {
  label: string;
};

const DropDownList = ({
  label,
  children,
}: React.PropsWithChildren<DropDownListProps>) => {
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
};

export default DropDownList;
