import styled from 'styled-components';
import { Order } from 'types';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

const List = styled.ul`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const Small = styled.small`
  font-weight: 500;
`;

const Price = styled.p`
  font-weight: 500;
`;

const Summary = styled.div`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

type OrderInfoProps = {
  order: Order;
};

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <Wrapper>
      <List>
        {order.items.map(({ product }) => (
          <li key={product.name}>
            <p>{product.name}</p>
            <Small>
              {product.price}lei({product.quantity}g)
            </Small>
          </li>
        ))}
      </List>

      <Summary>
        <Price>total: {order.total_price}lei</Price>
        <Small>
          {new Date(order.orderedAt).toLocaleDateString()}
          {order.completedAt &&
            `-${new Date(order.completedAt).toLocaleDateString()}`}
        </Small>
      </Summary>
    </Wrapper>
  );
};

export default OrderInfo;
