import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { Leaves } from '@/shared/Leaves';
import { withSession } from '@/utils/withSession';
import Head from 'next/head';

export default function Management() {
  return (
    <>
      <Head>
        <title>Management</title>
      </Head>

      <Leaves height="224px" />
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

Management.withLayout = withManagementStoreLayout;
