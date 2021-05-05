import styled from 'styled-components';
import Button from '@/shared/Button';
import MinusSvg from '@/icons/minus.svg';
import PlusSvg from '@/icons/plus.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const CountInput = styled.input`
  border: 0;
  width: calc(var(--baseline) * 2);
  background-color: transparent;
  color: var(--accent-text-dark);
  border-bottom: 1px solid var(--accent);
  text-align: center;

  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

type CounterProps = {
  count?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onDecrement?: (value: number) => void;
  onIncrement?: (value: number) => void;
};

const Counter = ({
  min = 0,
  max = Infinity,
  count = min,
  onChange,
  onDecrement = onChange,
  onIncrement = onChange,
}: CounterProps) => {
  const getValidCount = (curCount: number, minVal: number, maxVal: number) => {
    if (curCount < minVal) return minVal;
    if (curCount > maxVal) return maxVal;
    return curCount;
  };

  const handleDecrement = () => {
    const validCount = getValidCount(count, min, max);

    onDecrement(validCount > min ? validCount - 1 : min);
  };

  const handleIncrement = () => {
    const validCount = getValidCount(count, min, max);

    onIncrement(validCount < max ? validCount + 1 : max);
  };

  return (
    <Wrapper>
      <Button icon noPadding onClick={handleDecrement}>
        <MinusSvg />
      </Button>
      <CountInput
        type="number"
        value={getValidCount(count, min, max)}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) =>
          onChange(getValidCount(+e.currentTarget.value, min, max))
        }
      />
      <Button icon noPadding onClick={handleIncrement}>
        <PlusSvg />
      </Button>
    </Wrapper>
  );
};

export default Counter;
