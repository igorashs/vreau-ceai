import styled from 'styled-components';
import { StyledLink } from './StyledLink';
import { DropDown } from './DropDown';
import { managementLinks } from '@/utils/links';

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

export function ManagementMenu() {
  return (
    <Wrapper>
      <h4>Gestionare</h4>

      <h5>Users management</h5>
      <DropDown label="Utilizatori">
        {users.map((l) => (
          <li key={l.href}>
            <StyledLink {...l} />
          </li>
        ))}
      </DropDown>

      <h5>Shop management</h5>
      <DropDown label="Comenzi">
        {orders.map((l) => (
          <li key={l.href}>
            <StyledLink {...l} />
          </li>
        ))}
      </DropDown>

      <DropDown label="Produse">
        {products.map((l) => (
          <li key={l.href}>
            <StyledLink {...l} />
          </li>
        ))}
      </DropDown>

      <DropDown label="Categorii">
        {categories.map((l) => (
          <li key={l.href}>
            <StyledLink {...l} />
          </li>
        ))}
      </DropDown>
    </Wrapper>
  );
}
