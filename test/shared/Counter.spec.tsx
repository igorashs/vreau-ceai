import { fireEvent, render } from '@/utils/test-utils';
import Counter from '@/shared/Counter';

describe('Counter', () => {
  it('renders correctly', () => {
    const onChangeMock = jest.fn();
    const onSelectMock = jest.fn();

    const { container, getByRole } = render(
      <Counter onChange={onChangeMock} />,
    );

    const counterInput = getByRole('spinbutton');
    counterInput.onselect = onSelectMock;

    fireEvent.focus(counterInput);

    expect(onSelectMock).toBeCalledTimes(1);
    expect(counterInput).toHaveValue(0);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('.onChange', () => {
    it('returns changed value', () => {
      const onChangeMock = jest.fn();

      const { getByRole } = render(<Counter onChange={onChangeMock} />);

      const counterInput = getByRole('spinbutton');
      fireEvent.change(counterInput, { target: { value: '23' } });

      expect(onChangeMock).toBeCalledTimes(1);
      expect(onChangeMock).toBeCalledWith(23);
      expect(counterInput).toHaveValue(0);
    });
  });

  describe('min/max props limits', () => {
    it('remains between limits', () => {
      const onChangeMock = jest.fn();
      const min = 1;
      const max = 10;

      const { getByRole } = render(
        <Counter onChange={onChangeMock} min={min} max={max} />,
      );

      const counterInput = getByRole('spinbutton');

      expect(counterInput).toHaveValue(min);
      fireEvent.change(counterInput, { target: { value: '0' } });
      expect(onChangeMock).toBeCalledWith(min);

      fireEvent.change(counterInput, { target: { value: '11' } });
      expect(onChangeMock).toBeCalledWith(max);

      expect(onChangeMock).toBeCalledTimes(2);
    });
  });

  describe('count prop', () => {
    it('sets the current Counter value', () => {
      const onChangeMock = jest.fn();
      const count = 23;

      const { getByRole } = render(
        <Counter onChange={onChangeMock} count={count} />,
      );

      expect(getByRole('spinbutton')).toHaveValue(count);
    });

    it('respects min/max limits', () => {
      const onChangeMock = jest.fn();
      const min = 1;
      const max = 10;

      const { getByRole, rerender } = render(
        <Counter onChange={onChangeMock} min={min} max={max} count={0} />,
      );

      const counterInput = getByRole('spinbutton');
      expect(counterInput).toHaveValue(min);

      rerender(
        <Counter onChange={onChangeMock} min={min} max={max} count={23} />,
      );

      expect(counterInput).toHaveValue(max);
    });
  });

  describe('.onDecrement', () => {
    it('has onChange default handler', () => {
      const onChangeMock = jest.fn();

      const { getAllByRole } = render(
        <Counter onChange={onChangeMock} count={4} />,
      );

      const [decrementBtn] = getAllByRole('button');
      fireEvent.click(decrementBtn);

      expect(onChangeMock).toBeCalledTimes(1);
      expect(onChangeMock).toBeCalledWith(3);
    });

    it('has its own handler', () => {
      const onChangeMock = jest.fn();
      const onDecrementMock = jest.fn();

      const { getAllByRole } = render(
        <Counter
          onChange={onChangeMock}
          count={4}
          onDecrement={onDecrementMock}
        />,
      );

      const [decrementBtn] = getAllByRole('button');
      fireEvent.click(decrementBtn);

      expect(onChangeMock).toBeCalledTimes(0);
      expect(onDecrementMock).toBeCalledTimes(1);
      expect(onDecrementMock).toBeCalledWith(3);
    });

    it('respects min/max limits', () => {
      const onChangeMock = jest.fn();
      const min = 2;
      const max = 10;

      const { getAllByRole, rerender } = render(
        <Counter onChange={onChangeMock} min={min} max={max} count={-2} />,
      );

      const [decrementBtn] = getAllByRole('button');
      fireEvent.click(decrementBtn);

      expect(onChangeMock).toBeCalledWith(min);

      rerender(
        <Counter onChange={onChangeMock} min={min} max={max} count={22} />,
      );
      fireEvent.click(decrementBtn);

      expect(onChangeMock).toBeCalledTimes(2);
      expect(onChangeMock).toBeCalledWith(max - 1);
    });
  });

  describe('.onIncrement', () => {
    it('has onChange default handler', () => {
      const onChangeMock = jest.fn();

      const { getAllByRole } = render(
        <Counter onChange={onChangeMock} count={4} />,
      );

      const [, incrementBtn] = getAllByRole('button');
      fireEvent.click(incrementBtn);

      expect(onChangeMock).toBeCalledTimes(1);
      expect(onChangeMock).toBeCalledWith(5);
    });

    it('has its own handler', () => {
      const onChangeMock = jest.fn();
      const onIncrementMock = jest.fn();

      const { getAllByRole } = render(
        <Counter
          onChange={onChangeMock}
          count={4}
          onIncrement={onIncrementMock}
        />,
      );

      const [, incrementBtn] = getAllByRole('button');
      fireEvent.click(incrementBtn);

      expect(onChangeMock).toBeCalledTimes(0);
      expect(onIncrementMock).toBeCalledTimes(1);
      expect(onIncrementMock).toBeCalledWith(5);
    });

    it('respects min/max limit', () => {
      const onChangeMock = jest.fn();
      const min = 2;
      const max = 10;

      const { getAllByRole, rerender } = render(
        <Counter onChange={onChangeMock} min={min} max={max} count={-2} />,
      );

      const [, incrementBtn] = getAllByRole('button');
      fireEvent.click(incrementBtn);

      expect(onChangeMock).toBeCalledWith(min + 1);

      rerender(
        <Counter onChange={onChangeMock} min={min} max={max} count={22} />,
      );

      fireEvent.click(incrementBtn);

      expect(onChangeMock).toBeCalledTimes(2);
      expect(onChangeMock).toBeCalledWith(max);
    });
  });
});
