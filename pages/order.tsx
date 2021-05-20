import withBaseLayout from '@/layouts/BaseLayout';
import Head from 'next/head';
import styled from 'styled-components';
import Form, { FormAction } from '@/shared/Form';
import { withSessionServerSideProps } from '@/utils/withSession';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { orderSubmitSchema } from '@/utils/validator/schemas/order';
import TextField from '@/shared/TextField';
import Button from '@/shared/Button';
import { useCart } from 'contexts/CartContext';
import { createOrder } from 'services/ceaiApi';
import { useState } from 'react';
import Label from '@/shared/Label';
import { LabelMessage, OrderSubmit } from 'types';

const FormWrapper = styled.div`
  max-width: var(--max-input-width);
  width: var(--max-input-width);
`;

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

export default function Order() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(orderSubmitSchema),
  });

  const [cart, cartDispatch] = useCart();
  const [label, setLabel] = useState<LabelMessage>();

  const onSubmit = async (data: OrderSubmit) => {
    const items = cart.items.map(({ product, count }) => ({
      product_id: product._id,
      count,
    }));

    const res = await createOrder({
      info: data,
      items,
    });

    if (res.success) {
      setLabel({
        success: true,
        message: `comanda cu nr. ${res.number} a fost trimisă, un operator vă va contacta încurând.`,
      });

      cartDispatch({ type: 'clear-cart' });
    }

    if (res?.errors) {
      res.errors.forEach((error) => {
        const { message, name } = error;
        if (name) setError(name, { message });
      });
    } else if (!res.success) {
      setLabel({
        success: false,
        message: 'comanda nu a fost trimisă, goliți coșul și încercați din nou',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Comandă</title>
      </Head>

      <Wrapper>
        {cart?.itemsCount <= 0 ? (
          !label && <p>coșul este gol :(</p>
        ) : (
          <>
            <h4>Comandă</h4>

            <FormWrapper>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  name="tel"
                  label="telefon"
                  placeholder="ex: 061234567"
                  error={errors?.tel?.message}
                  passRef={register}
                  type="tel"
                />
                <TextField
                  name="address"
                  label="adresa"
                  placeholder="ex: or. Strășeni str. Mihai Em. nr. 28"
                  error={errors?.address?.message}
                  passRef={register}
                  type="text"
                />
                <FormAction justify="flex-end">
                  <Button disabled={cart.itemsCount <= 0}>trimite</Button>
                </FormAction>
              </Form>
            </FormWrapper>
          </>
        )}

        {label && (
          <Label error={!label.success} success={label.success}>
            {label.message}
          </Label>
        )}
      </Wrapper>
    </>
  );
}

export const getServerSideProps = withSessionServerSideProps(
  async ({ req }) => {
    const { isAuth } = req.session;

    if (!isAuth) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: {} };
  },
);

Order.withLayout = withBaseLayout;
