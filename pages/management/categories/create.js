import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { Button } from '@/shared/Button';
import { TextField } from '@/shared/TextField';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import { Form, FormAction } from '@/shared/Form';
import { Label } from '@/shared/Label';
import { createCategory } from 'services/ceaiApi';
import { useState } from 'react';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';

export default function Create() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(categorySchema)
  });
  const [label, setLabel] = useState();

  const onSubmit = async (data) => {
    const res = await createCategory(data);

    if (res.success) {
      setLabel({ success: true, message: 'categoria a fost creată ^-^' });
    } else {
      setLabel(null);
    }

    if (res?.errors) {
      res.errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <>
      <Head>
        <title>Add category</title>
      </Head>

      <h4>Adăugare categorie</h4>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name="name"
          label="nume"
          error={errors?.name?.message}
          passRef={register}
          type="text"
        />
        <FormAction justify="flex-end">
          <Button>adaugă</Button>
        </FormAction>

        {label && (
          <Label error={!label.success} success={label.success}>
            {label.message}
          </Label>
        )}
      </Form>
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

Create.withLayout = withManagementStoreLayout;
