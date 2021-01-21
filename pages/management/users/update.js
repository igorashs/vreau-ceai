import styled from 'styled-components';
import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { TextField } from '@/shared/TextField';
import { Button } from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { emailSchema } from '@/utils/validator/schemas/user';
import { findUser, updateUserManagerPermission } from 'services/ceaiApi';
import { useState, useEffect } from 'react';
import { Form, FormAction } from '@/shared/Form';
import { Label } from '@/shared/Label';
import { CheckBox } from '@/shared/CheckBox';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';

const Wrapper = styled.div`
  display: grid;
  gap: var(--baseline);
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 7px 0;
  border-bottom: 1px solid var(--layout);
`;

export default function Update() {
  const [dbUser, setDbUser] = useState();
  const [label, setLabel] = useState();

  const handleFindUserSubmit = async ({ email }) => {
    const res = await findUser(email);

    if (res.success) {
      setLabel({ success: true, message: 'utilizatorul a fost găsit' });
      setDbUser({ ...res.user });
    } else {
      return res.errors;
    }
  };

  const handleUpdateUserSubmit = async ({ isManager }) => {
    const res = await updateUserManagerPermission(dbUser._id, isManager);

    if (res.success) {
      setDbUser({ ...res.user });
      setLabel({
        success: true,
        message: 'utilizatorul a fost modificat :)'
      });
    } else {
      setLabel({
        success: false,
        message: 'ceva nu a mers bine :('
      });
    }
  };

  return (
    <>
      <Head>
        <title>Modify user</title>
      </Head>
      <Wrapper>
        <h4 id="scroll">Modificare Utilizator</h4>
        <FindUserForm onFindUserSubmit={handleFindUserSubmit} />

        {label && (
          <Label error={!label.success} success={label.success}>
            {label.message}
          </Label>
        )}

        {dbUser && (
          <UpdateUserForm
            dbUser={dbUser}
            onUpdateUserSubmit={handleUpdateUserSubmit}
          />
        )}
      </Wrapper>
    </>
  );
}

function FindUserForm({ onFindUserSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(emailSchema)
  });

  const onSubmit = async (data) => {
    const errors = await onFindUserSubmit(data);

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
        name="email"
        label="user email"
        error={errors?.email?.message}
        passRef={register}
        type="email"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
}

function UpdateUserForm({ onUpdateUserSubmit, dbUser }) {
  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      isManager: dbUser.isManager
    }
  });

  useEffect(() => {
    reset({
      isManager: dbUser.isManager
    });
  }, [dbUser]);

  return (
    <Form onSubmit={handleSubmit(onUpdateUserSubmit)}>
      <div>
        <UserData>
          <Label>name</Label>
          {dbUser.name}
        </UserData>
        <UserData>
          <Label>email</Label>
          {dbUser.email}
        </UserData>
        <UserData>
          <Label>permisiuni</Label>
          <CheckBox label="manager" passRef={register} name="isManager" />
        </UserData>
      </div>
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
