import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { useState } from 'react';
import { Label } from '@/shared/Label';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';
import { DropDown } from '@/shared/DropDown';
import { findCategory, updateCategory, deleteCategory } from 'services/ceaiApi';
import { UpdateCategoryForm } from '@/shared/UpdateCategoryForm';
import { FindCategoryForm } from '@/shared/FindCategoryForm';

export default function Update() {
  const [dbCategory, setDbCategory] = useState();
  const [label, setLabel] = useState();

  const handleFindCategorySubmit = async ({ name }) => {
    const res = await findCategory(name);

    if (res.success) {
      setLabel({ success: true, message: 'Categoria a fost găsită' });
      setDbCategory({ ...res.category });
    } else {
      setLabel({ success: false, message: 'Categoria nu a fost găsită :(' });
      setDbCategory(null);
      return res.errors;
    }
  };

  const handleUpdateCategorySubmit = async (data) => {
    const res = await updateCategory(dbCategory._id, data);

    if (res.success) {
      setLabel({ success: true, message: 'Categoria a fost modificată' });
      setDbCategory({ ...res.category });
    } else {
      setLabel({
        success: false,
        message: 'Categoria nu a fost modificată :('
      });
      return res.errors;
    }
  };

  const handleDeleteCategory = async () => {
    const res = await deleteCategory(dbCategory._id);

    if (res.success) {
      setLabel({ success: true, message: 'Categoria a fost ștearsă' });
      setDbCategory(null);
    } else {
      setLabel({ success: false, message: 'Categoria nu a fost ștearsă :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Update Category</title>
      </Head>

      <h4>Modificare categorie</h4>
      <FindCategoryForm onFindCategorySubmit={handleFindCategorySubmit} />

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
      )}

      {dbCategory && (
        <DropDown
          title={dbCategory?.name}
          showInitial={true}
          onDeleteClick={handleDeleteCategory}
        >
          <UpdateCategoryForm
            category={dbCategory}
            onUpdateCategorySubmit={handleUpdateCategorySubmit}
          />
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
