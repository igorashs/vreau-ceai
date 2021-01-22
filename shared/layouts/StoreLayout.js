import styled from 'styled-components';
import { withBaseLayout } from './BaseLayout';
import { ManagementMenu } from '@/shared/ManagementMenu';
import breakpoints from 'GlobalStyle/breakpoints';

const StoreGrid = styled.div`
  display: grid;
  gap: calc(var(--baseline) * 4);

  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 224px 1fr;
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
        {Menu ? <Menu /> : <p>No menu provided</p>}
        <StoreContentWrapper>{children}</StoreContentWrapper>
      </StoreGrid>
    </>
  );
}

export const createStoreLayout = (Menu) => (component) =>
  withBaseLayout(<StoreLayout Menu={Menu}>{component}</StoreLayout>);

export const withManagementStoreLayout = createStoreLayout(ManagementMenu);
