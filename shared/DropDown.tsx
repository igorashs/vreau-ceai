import styled from 'styled-components';
import Button from '@/shared/Button';
import BoxRemoveSvg from '@/icons/box-remove.svg';
import ArrowSvg from '@/icons/arrow.svg';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
  padding-bottom: calc(var(--baseline) / 2);
  border-bottom: 1px solid var(--layout);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--baseline) / 2);
`;

type HideStyledProps = {
  hide?: boolean;
};

const Action = styled.div<HideStyledProps>`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: calc(var(--baseline) / 2);

  button:last-child {
    transform: rotate(-90deg);
  }

  ${({ hide }) => hide && 'button:last-child {transform: rotate(90deg);}'}
`;

const Body = styled.div<HideStyledProps>`
  ${({ hide }) => hide && 'display: none;'}
`;

type DropDownProps = {
  title: string;
  label?: string;
  showInitial?: boolean;
  onDeleteClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  customHeading?: React.ReactElement;
};

const DropDown = ({
  title,
  label,
  onDeleteClick,
  showInitial = false,
  customHeading,
  children,
}: React.PropsWithChildren<DropDownProps>) => {
  const [hide, setHide] = useState(!showInitial);

  return (
    <Wrapper>
      <Header>
        {customHeading || (
          <>
            <h5>{title}</h5>
            {label && <small>{label}</small>}
          </>
        )}
        <Action hide={hide}>
          {onDeleteClick && (
            <Button icon btnStyle="danger" onClick={onDeleteClick} noPadding>
              <BoxRemoveSvg />
            </Button>
          )}
          <Button icon onClick={() => setHide((e) => !e)} noPadding>
            <ArrowSvg />
          </Button>
        </Action>
      </Header>
      <Body hide={hide}>{children}</Body>
    </Wrapper>
  );
};

export default DropDown;
