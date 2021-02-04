import styled from 'styled-components';
import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import {
  getProducts,
  getCategories,
  updateProduct,
  deleteProduct
} from 'services/ceaiApi';
import { useState, useEffect } from 'react';
import { ProductForm } from '@/shared/ProductForm';
import { DropDown } from '@/shared/DropDown';
import { DropDownList } from '@/shared/DropDownList';
import { Label } from '@/shared/Label';
import { Filter } from '@/shared/Filter';
import { getFormData } from '@/utils/getFormData';
import { Pagination } from '@/shared/Pagination';
import Head from 'next/head';

const List = styled.ul`
  margin: var(--baseline) 0;
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

const allowedFilters = [
  { text: 'Recomandate', value: 'recommend' },
  {
    text: 'Preț crescător',
    value: 'ascPrice'
  },
  {
    text: 'Preț descrescător',
    value: 'descPrice'
  },
  {
    text: 'Cantitate crescătoare',
    value: 'ascQuantity'
  },
  ,
  {
    text: 'Cantitate descrescătoare',
    value: 'descQuantity'
  }
];

const PRODUCTS_PER_PAGE = 5;

export default function Products() {
  const [filters, setFilters] = useState(new Set());
  const [dbProducts, setDbProducts] = useState();
  const [dbCategories, setDbCategories] = useState();
  const [label, setLabel] = useState();
  const [totalPages, setTotalPages] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    }
  }, []);

  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      const res = await getProducts(
        [...filters],
        PRODUCTS_PER_PAGE,
        pageNumber * PRODUCTS_PER_PAGE
      );

      if (res.success) {
        setDbProducts(res.products);
      } else {
        setLabel({
          success: false,
          message: 'Nu au fost găsit niciun produs'
        });
      }
    }
  };

  useEffect(async () => {
    const res = await getProducts([...filters], PRODUCTS_PER_PAGE);

    if (res.success) {
      setDbProducts(res.products);
      setTotalPages(Math.ceil(res.count / PRODUCTS_PER_PAGE));
    } else {
      setDbProducts(null);
      setLabel({
        success: false,
        message: 'Nu au fost găsit niciun produs'
      });
    }
  }, [filters]);

  const handleProductSubmit = async (id, data) => {
    const formData = getFormData(data);
    const res = await updateProduct(id, formData);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost modificat' });
      setDbProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...res.product } : p))
      );
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
      return res.errors;
    }
  };

  const handleDeleteProduct = async (id) => {
    const res = await deleteProduct(id);

    if (res.success) {
      setLabel({ success: true, message: 'Produsul a fost șters' });
      setDbProducts((prev) =>
        prev.length > 1 ? prev.filter((p) => p._id !== id) : null
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

Products.withLayout = withManagementStoreLayout;
