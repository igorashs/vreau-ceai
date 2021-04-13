import styled from 'styled-components';
import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSessionServerSideProps } from '@/utils/withSession';
import {
  getProducts,
  getCategories,
  updateProduct,
  deleteProduct,
} from 'services/ceaiApi';
import { useState, useEffect } from 'react';
import ProductForm from '@/shared/ProductForm';
import DropDown from '@/shared/DropDown';
import DropDownList from '@/shared/DropDownList';
import Label from '@/shared/Label';
import Filter from '@/shared/Filter';
import Pagination from '@/shared/Pagination';
import Head from 'next/head';
import { Category, LabelMessage, Product } from 'types';

const List = styled.ul`
  margin: var(--baseline) 0;
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const allowedFilters = [
  { text: 'Recomandate', value: 'recommend' },
  {
    text: 'Preț crescător',
    value: 'ascPrice',
  },
  {
    text: 'Preț descrescător',
    value: 'descPrice',
  },
  {
    text: 'Cantitate crescătoare',
    value: 'ascQuantity',
  },
  {
    text: 'Cantitate descrescătoare',
    value: 'descQuantity',
  },
];

const PRODUCTS_PER_PAGE = 5;

export default function Products() {
  const [filters, setFilters] = useState(new Set<string>());
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [label, setLabel] = useState<LabelMessage>();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategories();

      if (res.success) {
        setDbCategories(res.categories);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      const res = await getProducts(
        [...filters],
        PRODUCTS_PER_PAGE,
        pageNumber * PRODUCTS_PER_PAGE,
      );

      if (res.success) {
        setDbProducts(res.products);
      } else {
        setLabel({
          success: false,
          message: 'Nu au fost găsit niciun produs',
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProducts([...filters], PRODUCTS_PER_PAGE);

      if (res.success) {
        setDbProducts(res.products);
        setTotalPages(Math.ceil(res.count / PRODUCTS_PER_PAGE));
      } else {
        setDbProducts([]);
        setLabel({
          success: false,
          message: 'Nu au fost găsit niciun produs',
        });
      }
    };

    fetchData();
  }, [filters]);

  const handleProductSubmit = async (id: string, data: FormData) => {
    const res = await updateProduct(id, data);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost modificat' });
      setDbProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...res.product } : p)),
      );
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
    }

    return res.errors;
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await deleteProduct(id);

    if (res.success) {
      setLabel({ success: true, message: 'Produsul a fost șters' });
      setDbProducts((prev) =>
        prev.length > 1 ? prev.filter((p) => p._id !== id) : [],
      );
    } else {
      setLabel({ success: false, message: 'Produsul nu a fost șters :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <h4>Toate produsele</h4>

      <DropDownList label="Filtre">
        {allowedFilters.map((f) => (
          <li key={f.value}>
            <Filter
              text={f.text}
              checked={filters.has(f.value)}
              onChange={() =>
                setFilters((e) => {
                  const newFilters = new Set(e);

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

      {dbProducts && (
        <>
          <List>
            {dbProducts.map((product) => (
              <li key={product._id}>
                <DropDown
                  title={product?.name}
                  onDeleteClick={() => handleDeleteProduct(product._id)}
                >
                  <ProductForm
                    product={product}
                    categories={dbCategories}
                    onProductSubmit={(data) =>
                      handleProductSubmit(product._id, data)
                    }
                  />
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

export const getServerSideProps = withSessionServerSideProps(
  async ({ req }) => {
    const { isAuth, user } = req.session;

    if (!isAuth || !(user?.isAdmin || user?.isManager)) {
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

Products.withLayout = withManagementStoreLayout;
