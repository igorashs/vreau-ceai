import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSessionServerSideProps } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState, useEffect } from 'react';
import { createProduct, getCategories } from 'services/ceaiApi';
import { ProductForm } from '@/shared/ProductForm';
import Head from 'next/head';
import { Category, LabelMessage } from 'types';

export default function Create() {
  const [label, setLabel] = useState<LabelMessage>();
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategories();

      if (res.success) {
        setDbCategories(res.categories);
      }
    };

    fetchData();
  }, []);

  const handleProductSubmit = async (data: FormData) => {
    const res = await createProduct(data);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost creat ^-^' });
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
    }

    return res.errors;
  };

  return (
    <>
      <Head>
        <title>Add product</title>
      </Head>

      <h4>Adăugare produs</h4>

      <ProductForm
        onProductSubmit={handleProductSubmit}
        categories={dbCategories}
      />

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
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

Create.withLayout = withManagementStoreLayout;
