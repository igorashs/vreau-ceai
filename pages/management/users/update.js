import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { findUser, updateUserManagerPermission } from 'services/ceaiApi';
import { useState } from 'react';
import { Label } from '@/shared/Label';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';
import { FindUserForm } from '@/shared/FindUserForm';
import { UserForm } from '@/shared/UserForm';

export default function Update() {
  const [dbUser, setDbUser] = useState();
  const [label, setLabel] = useState();

  const handleFindUserSubmit = async ({ email }) => {
    const res = await findUser(email);

    if (res.success) {
      setLabel({ success: true, message: 'utilizatorul a fost găsit' });
      setDbUser({ ...res.user });
    } else {
      setLabel({ success: false, message: 'utilizatorul nu a fost găsit :(' });
      setDbUser(null);
      return res.errors;
    }
  };

  const handleUserSubmit = async ({ isManager }) => {
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

      <h4>Modificare Utilizator</h4>

      <FindUserForm onFindUserSubmit={handleFindUserSubmit} />

      {label && (
        <Label error={!label.success} success={label.success}>
          {label.message}
        </Label>
      )}

      {dbUser && <UserForm user={dbUser} onUserSubmit={handleUserSubmit} />}
    </>
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
