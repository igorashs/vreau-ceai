import styled from 'styled-components';
import Button from '@/shared/Button';
import ArrowSvg from '@/icons/arrow.svg';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 24px);
  grid-template-rows: 24px;
  align-items: center;
  justify-items: center;
  justify-content: center;
  gap: var(--baseline);

  > * {
    height: 24px;
    width: 24px;
  }

  > button:first-child {
    transform: rotate(180deg);
  }
`;

const CurrentPage = styled.p`
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--h5-font-size);
  text-decoration: underline;
`;

type PaginationProps = {
  min: number;
  max: number;
  currPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ onPageChange, min, max, currPage }: PaginationProps) => {
  const getValidPage = (
    currPageVal: number,
    minVal: number,
    maxVal: number,
  ) => {
    if (currPageVal < minVal) return minVal;
    if (currPageVal > maxVal) return maxVal;
    return currPageVal;
  };

  const handleOnPrevPageClick = () => {
    const validPage = getValidPage(currPage, min, max);

    onPageChange(validPage > min ? validPage - 1 : min);
  };

  const handleOnNextPageClick = () => {
    const validPage = getValidPage(currPage, min, max);

    onPageChange(validPage < max ? validPage + 1 : max);
  };

  if (max <= 1) return null;

  return (
    <Wrapper>
      <Button
        data-testid="prev-page"
        onClick={handleOnPrevPageClick}
        icon
        noPadding
        disabled={currPage <= min}
      >
        <ArrowSvg />
      </Button>
      <Button
        data-testid="first-page"
        btnStyle={currPage === min ? 'dark-text' : 'accent-text'}
        onClick={() => onPageChange(min)}
        disabled={currPage === min}
        noPadding
      >
        {min}
      </Button>
      <CurrentPage data-testid="curr-page">{currPage}</CurrentPage>
      <Button
        data-testid="last-page"
        btnStyle={currPage === max ? 'dark-text' : 'accent-text'}
        onClick={() => onPageChange(max)}
        disabled={currPage === max}
        noPadding
      >
        {max}
      </Button>
      <Button
        data-testid="next-page"
        onClick={handleOnNextPageClick}
        icon
        noPadding
        disabled={currPage >= max}
      >
        <ArrowSvg />
      </Button>
    </Wrapper>
  );
};

export default Pagination;
