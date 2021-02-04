import styled from 'styled-components';
import { TeaRecommendation } from '@/shared/TeaRecommendation';
import breakpoints from 'GlobalStyle/breakpoints';
import { useState, useEffect } from 'react';
import { getRecommendedProducts } from 'services/ceaiApi';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--baseline);

  li {
    flex-basis: 252px;
  }

  @media (min-width: ${breakpoints.lg}) {
    gap: calc(var(--baseline) * 4);
  }
`;

export const Recommendation = () => {
  const [products, setProducts] = useState();

  useEffect(async () => {
    const res = await getRecommendedProducts(3);

    if (res.success) {
      setProducts(res.products);
    }
  }, []);

  return (
    <>
      {products && (
        <List>
          {products.map((p) => (
            <li key={p._id}>
              <TeaRecommendation tea={p} />
            </li>
          ))}
        </List>
      )}
    </>
  );
};