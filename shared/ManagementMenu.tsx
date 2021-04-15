import styled from 'styled-components';
import { managementLinks } from '@/utils/links';
import { useSession } from 'contexts/SessionContext';
import StyledLink from './StyledLink';
import DropDownList from './DropDownList';

const Wrapper = styled.div`
  h4 {
    margin-bottom: var(--baseline);
  }

  h5 {
    margin-top: var(--baseline);
    margin-bottom: calc(var(--baseline) / 4);
  }
`;

const { users, orders, products, categories } = managementLinks;

const ManagementMenu = () => {
  const { user } = useSession();

  return (
    <Wrapper>
      <h4>Gestionare</h4>

      {user?.isAdmin && (
        <>
          <h5>Users management</h5>
          <DropDownList label="Utilizatori">
            {users.map((l) => (
              <li key={l.href}>
                <StyledLink {...l} />
              </li>
            ))}
          </DropDownList>
        </>
      )}

      {user?.isManager && (
        <>
          <h5>Shop management</h5>
          <DropDownList label="Comenzi">
            {orders.map((l) => (
              <li key={l.href}>
                <StyledLink {...l} />
              </li>
            ))}
          </DropDownList>

          <DropDownList label="Produse">
            {products.map((l) => (
              <li key={l.href}>
                <StyledLink {...l} />
              </li>
            ))}
          </DropDownList>

          <DropDownList label="Categorii">
            {categories.map((l) => (
              <li key={l.href}>
                <StyledLink {...l} />
              </li>
            ))}
          </DropDownList>
        </>
      )}
    </Wrapper>
  );
};

export default ManagementMenu;
