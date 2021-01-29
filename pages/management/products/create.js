import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { Label } from '@/shared/Label';
import { useState, useEffect } from 'react';
import { createProduct, getCategories } from 'services/ceaiApi';
import { getFormData } from '@/utils/getFormData';
import { ProductForm } from '@/shared/ProductForm';
import Head from 'next/head';

export default function Products() {
  const [label, setLabel] = useState();
  const [dbCategories, setDbCategories] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    }
  }, []);

  const handleProductSubmit = async (data) => {
    const formData = getFormData(data);
    const res = await createProduct(formData);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost creat ^-^' });
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
      return res.errors;
    }
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
