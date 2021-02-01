import styled from 'styled-components';
import { StyledLink } from './StyledLink';
import { DropDownList } from './DropDownList';
import { useState, useEffect } from 'react';
import { getCategories } from 'services/ceaiApi';

const Wrapper = styled.div`
  h5 {
    margin-bottom: calc(var(--baseline) / 4);
  }
`;

export function CategoryMenu() {
  const [dbCategories, setDbCategories] = useState();

  useEffect(async () => {
    const res = await getCategories();

    if (res.success) {
      setDbCategories(res.categories);
    }
  }, []);

  return (
    <Wrapper>
      <h5>Categorii</h5>
      {dbCategories && (
        <DropDownList label="Ceai">
          {dbCategories.map((c) => (
            <li key={c._id}>
              <StyledLink
                href={`/categories/${c.name}`}
                text={c.name}
                accent="dark"
              />
            </li>
          ))}
        </DropDownList>
      )}
    </Wrapper>
  );
}
