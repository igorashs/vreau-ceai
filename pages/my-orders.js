import { withBaseLayout } from '@/layouts/BaseLayout';
import Head from 'next/head';
import { DropDown } from '@/shared/DropDown';
import { useState, useEffect } from 'react';
import { DropDownList } from '@/shared/DropDownList';
import styled from 'styled-components';
import { getUserOrders, deleteOrder } from 'services/ceaiApi';
import { OrderInfo } from '@/shared/OrderInfo';
import { Label } from '@/shared/Label';
import { Filter } from '@/shared/Filter';
import { Pagination } from '@/shared/Pagination';
import { withSession } from '@/utils/withSession';

const List = styled.ul`
  margin: var(--baseline) 0;
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
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

const ORDERS_PER_PAGE = 3;

export default function MyOrders() {
  const [filters, setFilters] = useState(new Set());
  const [dbOrders, setDbOrders] = useState();
  const [label, setLabel] = useState();
  const [totalPages, setTotalPages] = useState();

  useEffect(async () => {
    const res = await getUserOrders([...filters], ORDERS_PER_PAGE);

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
      const res = await getUserOrders(
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
        <title>Comenzele mele</title>
      </Head>
      <Wrapper>
        <h3>Comenzele mele</h3>

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
                    showInitial={true}
                    title={'Nr. ' + order?.number}
                    onDeleteClick={
                      (order?.status === 'completed' ||
                        order?.status === 'canceled') &&
                      (() => handleDeleteOrder(order._id))
                    }
                  >
                    <OrderInfo order={order} />
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
      </Wrapper>
    </>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const { isAuth } = req.session;

  if (!isAuth) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return { props: {} };
});

MyOrders.withLayout = withBaseLayout;
