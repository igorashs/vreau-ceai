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
  onChange: (value: string | number) => void;
  onDecrement?: (value: string | number) => void;
  onIncrement?: (value: string | number) => void;
};

const Counter = ({
  count = 0,
  min = 0,
  max = Infinity,
  onChange,
  onDecrement = onChange,
  onIncrement = onChange,
}: CounterProps) => {
  return (
    <Wrapper>
      <Button
        icon
        noPadding
        onClick={() => onDecrement(count > min ? count - 1 : count)}
      >
        <MinusSvg />
      </Button>
      <CountInput
        type="number"
        value={count}
        onBlur={(e) => !e.currentTarget.value && onChange(min)}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          if (!e.currentTarget.value) {
            onChange('');
          } else {
            const value = +e.currentTarget.value;

            if (value >= min && value <= max) {
              onChange(value);
            }
          }
        }}
      />
      <Button
        icon
        noPadding
        onClick={() => onIncrement(count < max ? count + 1 : count)}
      >
        <PlusSvg />
      </Button>
    </Wrapper>
  );
};

export default Counter;
