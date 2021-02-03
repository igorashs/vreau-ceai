import { withBaseLayout } from '@/layouts/BaseLayout';
import Head from 'next/head';
import { useCart } from 'contexts/CartContext';
import { DropDown } from '@/shared/DropDown';
import { Button } from '@/shared/Button';
import styled from 'styled-components';
import { Counter } from '@/shared/Counter';
import { useSession } from 'contexts/SessionContext';
import { useRouter } from 'next/router';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

const List = styled.ul`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const ItemWrapper = styled.div`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--baseline) / 2);
`;

const Text = styled.p`
  display: flex;
  gap: calc(var(--baseline) / 2);
`;

const Price = styled(Text)`
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--baseline);
`;

export default function Cart() {
  const [cart, cartDispatch] = useCart();
  const router = useRouter();
  const { isAuth } = useSession();

  const handleOrderClick = () => {
    if (isAuth) {
      router.push('/order');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <Head>
        <title>Coș cu produse</title>
      </Head>
      <Wrapper>
        <h3>Coș</h3>

        {cart.items?.length ? (
          <>
            <List>
              {cart.items.map(({ product, count }) => (
                <li key={product.name}>
                  <DropDown
                    error
                    title={product.name}
                    showInitial
                    onDeleteClick={() =>
                      cartDispatch({
                        type: 'remove-item',
                        payload: {
                          product
                        }
                      })
                    }
                  >
                    <ItemWrapper>
                      <Quantity>
                        <p>cantitate</p>
                        <Counter
                          count={count}
                          min={1}
                          max={10000}
                          onChange={(count) =>
                            cartDispatch({
                              type: 'update-item',
                              payload: {
                                product,
                                count
                              }
                            })
                          }
                        />
                        <p>x{product.price}lei</p>
                      </Quantity>
                      <Text>
                        <span>preț:</span>
                        <span>
                          {count * product.price}lei(
                          {product.quantity * count}
                          g)
                        </span>
                      </Text>
                    </ItemWrapper>
                  </DropDown>
                </li>
              ))}
            </List>
            <Price>
              <span>Total:</span>
              <span>{cart.totalPrice}lei</span>
            </Price>
            <Actions>
              <Button
                onClick={() => cartDispatch({ type: 'clear-cart' })}
                btnStyle="danger"
              >
                goliți coșul
              </Button>
              <Button onClick={handleOrderClick}>comandă</Button>
            </Actions>
          </>
        ) : (
          <p>coșul este gol</p>
        )}
      </Wrapper>
    </>
  );
}

Cart.withLayout = withBaseLayout;
