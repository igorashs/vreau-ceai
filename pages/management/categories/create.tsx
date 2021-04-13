import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { Label } from '@/shared/Label';
import { createCategory } from 'services/ceaiApi';
import { useState } from 'react';
import { withSessionServerSideProps } from '@/utils/withSession';
import { CategoryForm } from '@/shared/CategoryForm';
import Head from 'next/head';
import { CategoryName, LabelMessage } from 'types';

export default function Create() {
  const [label, setLabel] = useState<LabelMessage | null>();

  const onSubmit = async (data: CategoryName) => {
    const res = await createCategory(data);

    if (res.success) {
      setLabel({ success: true, message: 'categoria a fost creată ^-^' });
    } else {
      setLabel(null);
      setLabel({ success: false, message: 'categoria nu fost creată :(' });
    }

    return res.errors;
  };

  return (
    <>
      <Head>
        <title>Add category</title>
      </Head>

      <h4>Adăugare categorie</h4>

      <CategoryForm onCategorySubmit={onSubmit} />

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
