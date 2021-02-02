import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import Head from 'next/head';
import styled from 'styled-components';
import Category from '@/models/Category';
import '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import { CategoryCard } from '@/shared/CategoryCard';
import breakpoints from 'GlobalStyle/breakpoints';

const List = styled.ul`
  display: grid;
  justify-content: center;
  gap: var(--baseline);

  grid-template-columns: repeat(auto-fit, 252px);

  @media (min-width: ${breakpoints.lg}) {
    gap: calc(var(--baseline) * 2);
    justify-content: start;
  }
`;

export default function Categories({ categories }) {
  return (
    <>
      <Head>
        <title>Categorii</title>
        <meta name="description" content="Toate categoriile de ceaiuri" />
      </Head>

      {categories && (
        <List>
          {categories.map((c) => (
            <li key={c.name}>
              <CategoryCard category={c} />
            </li>
          ))}
        </List>
      )}
    </>
  );
}

Categories.withLayout = withCategoryStoreLayout;

export const getStaticProps = async () => {
  await dbConnect();

  try {
    const dbCategories = await Category.find({})
      .populate({
        path: 'products',
        select: 'src',
        options: {
          perDocumentLimit: 1
        }
      })
      .lean();

    const categories = dbCategories.map((c) => ({
      name: c.name,
      src: c.products.length ? c.products[0].src : 'placeholder.png'
    }));

    return {
      props: {
        categories
      },
      revalidate: 1
    };
  } catch (error) {
    return {
      props: {
        categories: []
      },
      revalidate: 1
    };
  }
};
