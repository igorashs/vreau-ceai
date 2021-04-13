import styled from 'styled-components';
import Button from '@/shared/Button';
import ArrowSvg from '@/icons/arrow.svg';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

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

type PaginationProps = {
  min: number;
  max: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ onPageChange, min, max }: PaginationProps) => {
  const [page, setPage] = useState(min);

  useEffect(() => {
    onPageChange(page);
  }, [page]);

  return (
    <Wrapper>
      <Button
        onClick={() => setPage((n) => (n > min ? n - 1 : n))}
        icon
        disabled={page <= min}
      >
        <ArrowSvg />
      </Button>
      {[...Array(max + 1 || 0)].map((_, i) => (
        <Button
          key={nanoid()}
          btnStyle={page === i ? 'dark-text' : 'accent-text'}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        onClick={() => setPage((n) => (n < max ? n + 1 : n))}
        icon
        disabled={page >= max}
      >
        <ArrowSvg />
      </Button>
    </Wrapper>
  );
};

export default Pagination;
