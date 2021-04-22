import styled from 'styled-components';
import Button from '@/shared/Button';
import ArrowSvg from '@/icons/arrow.svg';
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
  currPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ onPageChange, min, max, currPage }: PaginationProps) => {
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
          key={nanoid()}
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

export default Pagination;