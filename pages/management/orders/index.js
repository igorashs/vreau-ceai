import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState, useEffect } from 'react';
import { DropDown } from '@/shared/DropDown';
import { DropDownList } from '@/shared/DropDownList';
import Head from 'next/head';
import { getOrders, updateOrder, deleteOrder } from 'services/ceaiApi';
import { OrderInfo } from '@/shared/OrderInfo';
import { ConsumerInfo } from '@/shared/ConsumerInfo';
import styled from 'styled-components';
import { Filter } from '@/shared/Filter';
import { Pagination } from '@/shared/Pagination';
import { OrderForm } from '@/shared/OrderForm';

const OrderWrapper = styled.div`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const List = styled.ul`
  margin: var(--baseline) 0;
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const allowedFilters = [
  { text: 'În procesare', value: 'processing' },
  {
    text: 'În livrare',
    value: 'inDelivery'
  },
  {
    text: 'Anulate',
    value: 'canceled'
  },
  {
    text: 'Finalizate',
    value: 'completed'
  },
  ,
  {
    text: 'Ultimele comandate',
    value: 'lastOrdered'
  },
  {
    text: 'Primele comandate',
    value: 'firstOrdered'
  }
];

const ORDERS_PER_PAGE = 5;

export default function Orders() {
  const [filters, setFilters] = useState(new Set());
  const [dbOrders, setDbOrders] = useState();
  const [label, setLabel] = useState();
  const [totalPages, setTotalPages] = useState();

  useEffect(async () => {
    const res = await getOrders([...filters], ORDERS_PER_PAGE);

    if (res.success) {
      setDbOrders(res.orders);
      setTotalPages(Math.ceil(res.count / ORDERS_PER_PAGE));
      setLabel(null);
    } else {
      setDbOrders(null);
      setLabel({
        success: false,
        message: 'Nu au fost găsit nicio comandă'
      });
    }
  }, [filters]);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      const res = await getOrders(
        [...filters],
        ORDERS_PER_PAGE,
        pageNumber * ORDERS_PER_PAGE
      );

      if (res.success) {
        setDbOrders(res.orders);
      } else {
        setLabel({
          success: false,
          message: 'Nu au fost găsit nicio comandă'
        });
      }
    }
  };

  const handleOrderSubmit = async (id, data) => {
    const res = await updateOrder(id, data);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost modificată' });
      setDbOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...res.order } : o))
      );
    } else {
      setLabel({ success: false, message: 'Comanda nu a fost modificată :(' });
      return res.errors;
    }
  };

  const handleDeleteOrder = async (id) => {
    const res = await deleteOrder(id);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost ștearsă' });
      setDbOrders((prev) =>
        prev.length > 1 ? prev.filter((o) => o._id !== id) : null
      );
    } else {
      setLabel({ success: false, message: 'Comanda nu a fost ștearsă :(' });
    }
  };

  return (
    <>
      <Head>
        <title>All orders</title>
      </Head>

      <h4>Toate comenzile</h4>

      <DropDownList label="Filtre">
        {allowedFilters.map((f) => (
          <li key={f.value}>
            <Filter
              id={f.value}
              text={f.text}
              checked={filters.has(f.value)}
              onChange={() =>
                setFilters((e) => {
                  const filters = new Set(e);

                  if (filters.has(f.value)) {
                    filters.delete(f.value);
                  } else {
                    filters.add(f.value);
                  }

                  return filters;
                })
              }
            />
          </li>
        ))}
      </DropDownList>

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
      )}

      {dbOrders && (
        <>
          <List>
            {dbOrders.map((order) => (
              <li key={order._id}>
                <DropDown
                  title={order?.number}
                  label={order?.status}
                  onDeleteClick={() => handleDeleteOrder(order._id)}
                >
                  <OrderWrapper>
                    <OrderInfo order={order} />
                    <ConsumerInfo
                      name={order.user.name}
                      email={order.user.email}
                      tel={order.tel}
                      address={order.address}
                    />
                    <OrderForm
                      order={order}
                      onOrderSubmit={(data) =>
                        handleOrderSubmit(order._id, data)
                      }
                    />
                  </OrderWrapper>
                </DropDown>
              </li>
            ))}
          </List>

          <Pagination
            onPageChange={handlePageChange}
            min={0}
            max={totalPages - 1}
          />
        </>
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

Orders.withLayout = withManagementStoreLayout;
