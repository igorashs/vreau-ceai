import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getCategories } from 'services/ceaiApi';
import { Category } from 'types';
import StyledLink from './StyledLink';
import DropDownList from './DropDownList';

const Wrapper = styled.div`
  h5 {
    margin-bottom: calc(var(--baseline) / 4);
  }
`;

const CategoryMenu = () => {
  const [dbCategories, setDbCategories] = useState<Category[]>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategories();

      if (res.success) {
        setDbCategories(res.categories);
      }
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <h5>Categorii</h5>
      {dbCategories && (
        <DropDownList label="Ceai">
          {dbCategories.map((c) => (
            <li key={c._id}>
              <StyledLink
                label={`Categoria ${c.name}`}
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
};

export default CategoryMenu;
