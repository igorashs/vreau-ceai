import styled from 'styled-components';
import { Button } from '@/shared/Button';
import ArrowSvg from '@/icons/arrow.svg';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 32px);
  grid-template-rows: 32px;
  align-items: center;
  justify-items: center;
  justify-content: center;
  gap: var(--baseline);

  > * {
    height: 100%;
    width: 100%;
  }

  > button:first-child {
    transform: rotate(180deg);
  }
`;

export const StaticPagination = ({ onPageChange, min, max, currPage }) => {
  return (
    <Wrapper>
      <Button
        onClick={() => onPageChange(currPage > min ? currPage - 1 : currPage)}
        icon
        disabled={currPage <= min}
      >
        <ArrowSvg />
      </Button>
      {[...Array(max + 1 || 0)].map((_, i) => (
        <Button
          key={i}
          btnStyle={currPage === i ? 'dark-text' : 'accent-text'}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currPage < max ? currPage + 1 : currPage)}
        icon
        disabled={currPage >= max}
      >
        <ArrowSvg />
      </Button>
    </Wrapper>
  );
};
