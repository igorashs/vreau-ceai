import withBaseLayout from '@/layouts/BaseLayout';
import Head from 'next/head';
import DropDown from '@/shared/DropDown';
import { useState, useEffect } from 'react';
import DropDownList from '@/shared/DropDownList';
import styled from 'styled-components';
import { getUserOrders, deleteOrder } from 'services/ceaiApi';
import OrderInfo from '@/shared/OrderInfo';
import Label from '@/shared/Label';
import Filter from '@/shared/Filter';
import { withSessionServerSideProps } from '@/utils/withSession';
import { LabelMessage, Order } from 'types';
import Pagination from '@/shared/Pagination';

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
    value: 'inDelivery',
  },
  {
    text: 'Anulate',
    value: 'canceled',
  },
  {
    text: 'Finalizate',
    value: 'completed',
  },
  {
    text: 'Ultimele comandate',
    value: 'lastOrdered',
  },
  {
    text: 'Primele comandate',
    value: 'firstOrdered',
  },
];

const ORDERS_PER_PAGE = 3;

export default function MyOrders() {
  const [filters, setFilters] = useState(new Set<string>());
  const [dbOrders, setDbOrders] = useState<Order[]>([]);
  const [label, setLabel] = useState<LabelMessage>();
  const [totalPages, setTotalPages] = useState(0);
  const [currPage, setCurrPage] = useState(1);

  const fetchUserOrderList = async () => {
    const res = await getUserOrders([...filters], ORDERS_PER_PAGE);

    if (res.success) {
      setDbOrders(res.orders);
      setTotalPages(Math.ceil(res.count / ORDERS_PER_PAGE));
      setCurrPage(1);
    } else {
      setDbOrders([]);
      setLabel({
        success: false,
        message: 'Nu au fost găsit nicio comandă',
      });
    }
  };

  useEffect(() => {
    fetchUserOrderList();
  }, [filters]);

  const handlePageChange = async (pageNumber: number) => {
    const res = await getUserOrders(
      [...filters],
      ORDERS_PER_PAGE,
      (pageNumber - 1) * ORDERS_PER_PAGE,
    );

    if (res.success) {
      setDbOrders(res.orders);
      setCurrPage(pageNumber);
    } else {
      setLabel({
        success: false,
        message: 'Nu au fost găsit nicio comandă',
      });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const res = await deleteOrder(id);

    if (res.success) {
      setLabel({ success: true, message: 'Comanda a fost ștearsă' });
      fetchUserOrderList();
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
                text={f.text}
                checked={filters.has(f.value)}
                onChange={() =>
                  setFilters((e) => {
                    const newFilters = new Set(e);
                    setTotalPages(0);

                    if (newFilters.has(f.value)) {
                      newFilters.delete(f.value);
                    } else {
                      newFilters.add(f.value);
                    }

                    return newFilters;
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
                    showInitial
                    title={`Nr. ${order?.number}`}
                    onDeleteClick={
                      order?.status === 'completed' ||
                      order?.status === 'canceled'
                        ? () => handleDeleteOrder(order._id)
                        : undefined
                    }
                  >
                    <OrderInfo order={order} />
                  </DropDown>
                </li>
              ))}
            </List>

            <Pagination
              onPageChange={handlePageChange}
              currPage={currPage}
              min={1}
              max={totalPages}
            />
          </>
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

MyOrders.withLayout = withBaseLayout;
