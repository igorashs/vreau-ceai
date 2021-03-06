import styled from 'styled-components';
import ManagementMenu from '@/shared/ManagementMenu';
import CategoryMenu from '@/shared/CategoryMenu';
import breakpoints from 'GlobalStyle/breakpoints';
import withBaseLayout from './BaseLayout';

const StoreGrid = styled.div`
  display: grid;
  gap: calc(var(--baseline) * 2);

  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 224px 1fr;

    gap: calc(var(--baseline) * 4);
  }
`;

const StoreContentWrapper = styled.div`
  display: grid;
  align-content: start;
  gap: var(--baseline);
`;

type StoreLayoutProps = {
  Menu: React.FC;
};

const StoreLayout = ({
  children,
  Menu,
}: React.PropsWithChildren<StoreLayoutProps>) => {
  return (
    <>
      <StoreGrid>
        {Menu && <Menu />}
        <StoreContentWrapper>{children}</StoreContentWrapper>
      </StoreGrid>
    </>
  );
};

export const createStoreLayout = (Menu: React.FC) => (
  component: React.ReactNode,
) => withBaseLayout(<StoreLayout Menu={Menu}>{component}</StoreLayout>);

export const withManagementStoreLayout = createStoreLayout(ManagementMenu);

export const withCategoryStoreLayout = createStoreLayout(CategoryMenu);
