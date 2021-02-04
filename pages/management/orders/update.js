import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState } from 'react';
import { DropDown } from '@/shared/DropDown';
import Head from 'next/head';
import { FindOrderNumberForm } from '@/shared/FindOrderNumberForm';
import { findOrder, updateOrder, deleteOrder } from 'services/ceaiApi';
import { OrderInfo } from '@/shared/OrderInfo';
import { ConsumerInfo } from '@/shared/ConsumerInfo';
import styled from 'styled-components';
import { OrderForm } from '@/shared/OrderForm';

const OrderWrapper = styled.div`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

export default function Update() {
  const [dbOrder, setDbOrder] = useState();
  const [label, setLabel] = useState();

  const handleFindOrderSubmit = async ({ number }) => {
    const res = await findOrder(number);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost găsită' });
      setDbOrder({ ...res.order });
    } else {
      setLabel({ success: false, message: 'Comanda nu a fost găsită :(' });
      setDbOrder(null);
      return res.errors;
    }
  };

  const handleOrderSubmit = async (data) => {
    const res = await updateOrder(dbOrder._id, data);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost modificată' });
      setDbOrder({ ...res.order });
    } else {
      setLabel({ success: false, message: 'Comanda nu a fost modificată :(' });
      return res.errors;
    }
  };

  const handleDeleteOrder = async () => {
    const res = await deleteOrder(dbOrder._id);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost ștearsă' });
      setDbOrder(null);
    } else {
      setLabel({ success: false, message: 'Comanda nu a fost ștearsă :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Update order</title>
      </Head>

      <h4>Modificare comandă</h4>
      <FindOrderNumberForm onFindOrderSubmit={handleFindOrderSubmit} />

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
      )}

      {dbOrder && (
        <DropDown
          title={dbOrder?.number}
          label={dbOrder?.status}
          showInitial={true}
          onDeleteClick={handleDeleteOrder}
        >
          <OrderWrapper>
            <OrderInfo order={dbOrder} />
            <ConsumerInfo
              name={dbOrder.user.name}
              email={dbOrder.user.email}
              tel={dbOrder.tel}
              address={dbOrder.address}
            />
            <OrderForm order={dbOrder} onOrderSubmit={handleOrderSubmit} />
          </OrderWrapper>
        </DropDown>
      )}
    </>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const { isAuth, user } = req.session;

  if (!isAuth || !(user.isAdmin || user.isManager)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: {} };
});

Update.withLayout = withManagementStoreLayout;
