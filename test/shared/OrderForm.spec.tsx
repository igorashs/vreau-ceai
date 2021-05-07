import { fireEvent, render, waitFor } from '@/utils/test-utils';
import OrderForm from '@/shared/OrderForm';
import { OrderStatus, OrderStatusErrorDetail } from 'types';
import { orderMessages } from '@/utils/validator/schemas/order';

const onOrderSubmitMock = jest.fn(
  (): Promise<OrderStatusErrorDetail[] | undefined> =>
    Promise.resolve(undefined),
);

type Order = OrderStatus & {
  _id: string;
};

describe('OrderForm', () => {
  it('renders correctly', () => {
    const order: Order = {
      _id: '1',
      status: 'processing',
    };

    const { container, getByRole } = render(
      <OrderForm onOrderSubmit={onOrderSubmitMock} order={order} />,
    );

    expect(getByRole('combobox')).toHaveValue(order.status);
    expect(getByRole('combobox')).not.toHaveAttribute('disabled');
    expect(getByRole('button')).not.toHaveAttribute('disabled');
    expect(container.firstChild).toMatchSnapshot();
  });

  it("doesn't modify with completed status", async () => {
    const order: Order = {
      _id: '1',
      status: 'completed',
    };

    const { getByRole } = render(
      <OrderForm onOrderSubmit={onOrderSubmitMock} order={order} />,
    );

    expect(getByRole('combobox')).toHaveAttribute('disabled');
    expect(getByRole('button')).toHaveAttribute('disabled');
    fireEvent.submit(getByRole('button'));

    await waitFor(() => expect(onOrderSubmitMock).not.toBeCalled());
  });

  describe('status validation', () => {
    it('should display invalid error', async () => {
      const order: Order = {
        _id: '1',
        status: 'inDelivery',
      };

      const { getByRole, getByText } = render(
        <OrderForm onOrderSubmit={onOrderSubmitMock} order={order} />,
      );

      fireEvent.change(getByRole('combobox'), {
        target: { value: 'notvalidvalue' },
      });

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(orderMessages.status.invalid)).toBeVisible(),
      );

      expect(onOrderSubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const order: Order = {
        _id: '1',
        status: 'inDelivery',
      };

      const { getByRole, getByText } = render(
        <OrderForm onOrderSubmit={onOrderSubmitMock} order={order} />,
      );

      const status: OrderStatus['status'] = 'canceled';
      const statusSelect = getByRole('combobox');

      fireEvent.change(statusSelect, { target: { value: 'notavalidvalue' } });
      fireEvent.submit(getByRole('button'));

      fireEvent.change(statusSelect, { target: { value: status } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onOrderSubmitMock).toBeCalledTimes(1));
      expect(onOrderSubmitMock).toBeCalledWith({ status });
      expect(statusSelect).toHaveValue(status);
      expect(getByText('status')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display required error', async () => {
      // pretend user bypass client validation
      onOrderSubmitMock.mockResolvedValueOnce([
        { message: orderMessages.status.required, name: 'status' },
      ]);

      const order: Order = {
        _id: '1',
        status: 'inDelivery',
      };

      const { getByRole, getByText } = render(
        <OrderForm onOrderSubmit={onOrderSubmitMock} order={order} />,
      );

      fireEvent.change(getByRole('combobox'), {
        target: { value: 'completed' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onOrderSubmitMock).toBeCalledTimes(1));
      expect(onOrderSubmitMock).toBeCalledWith({ status: 'completed' });
      expect(getByText(orderMessages.status.required)).toBeVisible();
    });
  });
});
