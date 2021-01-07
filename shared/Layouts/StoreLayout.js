import { withBaseLayout } from './BaseLayout';

function StoreLayout({ children }) {
  return <>{children}</>;
}

export const withStoreLayout = (component) =>
  withBaseLayout(<StoreLayout>{component}</StoreLayout>);
