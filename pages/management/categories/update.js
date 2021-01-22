import styled from 'styled-components';
import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { TextField } from '@/shared/TextField';
import { Button } from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import { Form, FormAction } from '@/shared/Form';
import { useState, useEffect } from 'react';
import { Label } from '@/shared/Label';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';
import { DropDown } from '@/shared/DropDown';
import { findCategory, updateCategory, deleteCategory } from 'services/ceaiApi';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

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

      <Wrapper>
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
      </Wrapper>
    </>
  );
}

function FindCategoryForm({ onFindCategorySubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(categorySchema)
  });

  const onSubmit = async (data) => {
    const errors = await onFindCategorySubmit(data);

    if (errors) {
      errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="numele categoriei"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
}

function UpdateCategoryForm({ onUpdateCategorySubmit, category }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
    defaultValues: {
      name: category.name
    }
  });

  useEffect(() => {
    reset({
      name: category.name
    });
  }, [category]);

  const onSubmit = async (data) => {
    const errors = await onUpdateCategorySubmit(data);

    if (errors) {
      errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="redenumire"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const { isAuth, user } = req.session;

  if (!isAuth || !user.isAdmin) {
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
