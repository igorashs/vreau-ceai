import { render } from '@/utils/test-utils';
import OrderInfo from '@/shared/OrderInfo';
import { Order } from 'types';

describe('OrderInfo', () => {
  it('renders correctly', () => {
    const order: Order = {
      _id: '1',
      user: {
        name: 'userName',
        email: 'user@u.com',
      },
      number: 'OR123',
      total_price: 500,
      status: 'processing',
      items: [
        {
          count: 1,
          product: { name: 'product1', price: 100, quantity: 50 },
        },
        {
          count: 2,
          product: { name: 'product2', price: 400, quantity: 100 },
        },
      ],
      address: 'add1',
      tel: '061111111',
      orderedAt: new Date('1/1/2021'),
      completedAt: new Date('1/3/2021'),
    };

    const { container, getByText, getAllByRole } = render(
      <OrderInfo order={order} />,
    );

    const listItems = getAllByRole('listitem');

    listItems.forEach((listItem, i) => {
      expect(listItem).toHaveTextContent(order.items[i].product.name);
      expect(listItem).toHaveTextContent(
        order.items[i].product.price.toString(),
      );
      expect(listItem).toHaveTextContent(
        order.items[i].product.quantity.toString(),
      );
    });

    expect(getByText(order.total_price, { exact: false })).toBeVisible();
    expect(
      getByText(order.orderedAt.toLocaleDateString(), { exact: false }),
    ).toBeVisible();

    if (order.completedAt)
      expect(
        getByText(order.completedAt.toLocaleDateString(), { exact: false }),
      ).toBeVisible();

    expect(container.firstChild).toMatchSnapshot();
  });
});
