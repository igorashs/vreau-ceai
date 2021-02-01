import styled from 'styled-components';
import { withBaseLayout } from './BaseLayout';
import { ManagementMenu } from '@/shared/ManagementMenu';
import { CategoryMenu } from '@/shared/CategoryMenu';
import breakpoints from 'GlobalStyle/breakpoints';

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

function StoreLayout({ children, Menu = null }) {
  return (
    <>
      <StoreGrid>
        {Menu && <Menu />}
        <StoreContentWrapper>{children}</StoreContentWrapper>
      </StoreGrid>
    </>
  );
}

export const createStoreLayout = (Menu) => (component) =>
  withBaseLayout(<StoreLayout Menu={Menu}>{component}</StoreLayout>);

export const withManagementStoreLayout = createStoreLayout(ManagementMenu);

export const withCategoryStoreLayout = createStoreLayout(CategoryMenu);
