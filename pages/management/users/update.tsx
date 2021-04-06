import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { findUser, updateUserManagerPermission } from 'services/ceaiApi';
import { useState } from 'react';
import { Label } from '@/shared/Label';
import { withSessionServerSideProps } from '@/utils/withSession';
import Head from 'next/head';
import { FindUserForm } from '@/shared/FindUserForm';
import { UserForm } from '@/shared/UserForm';
import { LabelMessage, User, UserEmail, UserPermissions } from 'types';

export default function Update() {
  const [dbUser, setDbUser] = useState<User | null>();
  const [label, setLabel] = useState<LabelMessage>();

  const handleFindUserSubmit = async (data: UserEmail) => {
    const res = await findUser(data);

    if (res.success) {
      setLabel({ success: true, message: 'utilizatorul a fost găsit' });
      setDbUser({ ...res.user });
      return [];
    }
    setLabel({ success: false, message: 'utilizatorul nu a fost găsit :(' });
    setDbUser(null);
    return res.errors;
  };

  const handleUserSubmit = async (data: UserPermissions) => {
    if (!dbUser) return;

    const res = await updateUserManagerPermission(dbUser._id, data);

    if (res.success) {
      setDbUser({ ...res.user });
      setLabel({
        success: true,
        message: 'utilizatorul a fost modificat :)',
      });
    } else {
      setLabel({
        success: false,
        message: 'ceva nu a mers bine :(',
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

export const getServerSideProps = withSessionServerSideProps(
  async ({ req }) => {
    const { isAuth, user } = req.session;

    if (!isAuth || !user?.isAdmin) {
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

Update.withLayout = withManagementStoreLayout;
