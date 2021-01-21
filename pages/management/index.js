import { withManagementStoreLayout } from '@/layouts/StoreLayout';
import { Leaves } from '@/shared/Leaves';
import { withSession } from '@/utils/withSession';

export default function Management() {
  return <Leaves />;
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
