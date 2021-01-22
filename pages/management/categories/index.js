import styled from 'styled-components';
import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { withSession } from '@/utils/withSession';
import { DropDown } from '@/shared/DropDown';
import {
  getCategories,
  updateCategory,
  deleteCategory
} from 'services/ceaiApi';
import { useState, useEffect } from 'react';
import { Label } from '@/shared/Label';
import Head from 'next/head';
import { UpdateCategoryForm } from '@/shared/UpdateCategoryForm';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

const List = styled.ul`
  display: grid;
  gap: calc(var(--baseline) / 2);
`;

export default function Categories() {
  const [dbCategories, setDbCategories] = useState();
  const [label, setLabel] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    } else {
      setLabel({
        success: false,
        message: 'Nu au fost găsite nicio categorie'
      });
    }
  }, []);

  const handleUpdateCategorySubmit = async (id, data) => {
    const res = await updateCategory(id, data);

    if (res.success) {
      setLabel({ success: true, message: 'Categoria a fost modificată' });
      setDbCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...res.category } : c))
      );
    } else {
      setLabel({
        success: false,
        message: 'Categoria nu a fost modificată :('
      });
      return res.errors;
    }
  };

  const handleDeleteCategory = async (id) => {
    const res = await deleteCategory(id);

    if (res.success) {
      setLabel({ success: true, message: 'Categoria a fost ștearsă' });
      setDbCategories((prev) =>
        prev.length > 1 ? prev.filter((c) => c._id !== id) : null
      );
    } else {
      setLabel({ success: false, message: 'Categoria nu a fost ștearsă :(' });
    }
  };

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>

      <Wrapper>
        <h4>Toate categoriile</h4>

        {label && (
          <Label error={!label.success} success={label.success}>
            {label.message}
          </Label>
        )}

        {dbCategories && (
          <List>
            {dbCategories.map((category) => (
              <li key={category._id}>
                <DropDown
                  title={category?.name}
                  onDeleteClick={() => handleDeleteCategory(category._id)}
                >
                  <UpdateCategoryForm
                    category={category}
                    onUpdateCategorySubmit={(data) =>
                      handleUpdateCategorySubmit(category._id, data)
                    }
                  />
                </DropDown>
              </li>
            ))}
          </List>
        )}
      </Wrapper>
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

Categories.withLayout = withManagementStoreLayout;
