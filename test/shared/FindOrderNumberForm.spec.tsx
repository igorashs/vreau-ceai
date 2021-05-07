import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import FindOrderNumberForm from '@/shared/FindOrderNumberForm';
import { OrderNumberErrorDetail } from 'types';
import { orderMessages } from '@/utils/validator/schemas/order';

const onFindOrderSubmitMock = jest.fn(
  (): Promise<OrderNumberErrorDetail[] | undefined> =>
    Promise.resolve(undefined),
);

describe('FindOrderNumberForm', () => {
  it('renders correctly', () => {
    const { container, getByRole } = render(
      <FindOrderNumberForm onFindOrderSubmit={onFindOrderSubmitMock} />,
    );

    expect(getByRole('textbox')).toHaveValue('');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('number validation', () => {
    beforeEach(() =>
      render(<FindOrderNumberForm onFindOrderSubmit={onFindOrderSubmitMock} />),
    );

    it('should display required error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(orderMessages.number.required)).toBeVisible(),
      );

      expect(onFindOrderSubmitMock).not.toBeCalled();
    });

    it('should display length error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.change(getByRole('textbox'), { target: { value: '123asd' } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(orderMessages.number.length)).toBeVisible(),
      );

      expect(onFindOrderSubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const { getByRole, getByText } = render(
        <FindOrderNumberForm onFindOrderSubmit={onFindOrderSubmitMock} />,
      );

      const number = '0JTNSLRDKKIAH91F';

      fireEvent.submit(getByRole('button'));
      fireEvent.change(getByRole('textbox'), {
        target: { value: number },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindOrderSubmitMock).toBeCalledTimes(1));
      expect(onFindOrderSubmitMock).toBeCalledWith({ number });
      expect(getByRole('textbox')).toHaveValue(number);
      expect(getByText('numărul comenzii')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display length error', async () => {
      // pretend user bypass client validation
      onFindOrderSubmitMock.mockResolvedValueOnce([
        { message: orderMessages.number.length, name: 'number' },
      ]);

      const { getByRole, getByText } = render(
        <FindOrderNumberForm onFindOrderSubmit={onFindOrderSubmitMock} />,
      );

      fireEvent.change(getByRole('textbox'), {
        target: { value: '0JTNSLRDKKIAH91F' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindOrderSubmitMock).toBeCalledTimes(1));
      expect(onFindOrderSubmitMock).toBeCalledWith({
        number: '0JTNSLRDKKIAH91F',
      });
      expect(getByText(orderMessages.number.length)).toBeVisible();
    });
  });
});
