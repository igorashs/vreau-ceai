import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { CreateProductForm } from '@/shared/CreateProductForm';
import { createProduct } from 'services/ceaiApi';
import { Label } from '@/shared/Label';
import { useState } from 'react';
import Head from 'next/head';

export default function Products() {
  const [label, setLabel] = useState();

  const handleCreateProductSubmit = async (data) => {
    const formData = new FormData();

    for (const name in data) {
      if (name === 'src') continue;

      formData.append(name, data[name]);
    }

    if (data.src[0]) {
      formData.append('src', data.src[0]);
    }

    const res = await createProduct(formData);

    if (res.success) {
      setLabel({ success: true, message: 'produsul a fost creat ^-^' });
    } else if (res.errors) {
      return res.errors;
    } else {
      setLabel({ success: false, message: 'ceva nu a mers bine :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Add product</title>
      </Head>

      <h4>Adăugare produs</h4>

      <CreateProductForm onCreateProductSubmit={handleCreateProductSubmit} />

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
