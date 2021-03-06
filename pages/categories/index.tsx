import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import Head from 'next/head';
import styled from 'styled-components';
import CategoryModel, {
  Category as CategoryModelType,
} from '@/models/Category';
import ProductModel, { Product } from '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import CategoryCard from '@/shared/CategoryCard';
import breakpoints from 'GlobalStyle/breakpoints';
import { Category } from 'types';
import { GetServerSideProps } from 'next';

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

type CategoriesProps = {
  categories: (Category & { src: string })[];
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <Head>
        <title>Categorii</title>
        <meta name="description" content="Toate categoriile de ceaiuri" />
      </Head>

      <List>
        {categories.map((c) => (
          <li key={c.name}>
            <CategoryCard category={c} />
          </li>
        ))}
      </List>
    </>
  );
}

Categories.withLayout = withCategoryStoreLayout;

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  try {
    const dbCategories: (CategoryModelType & {
      products: Product[];
    })[] = await CategoryModel.find({}).populate({
      path: 'products',
      select: 'src',
      model: ProductModel,
      options: {
        perDocumentLimit: 1,
      },
    });

    const categories = dbCategories.map((c) => {
      let src = c.products.length ? c.products[0].src : 'placeholder.png';
      if (src === 'placeholder.png') src = `/uploads/${src}`;

      return {
        name: c.name,
        src,
      };
    });

    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    return {
      props: {
        categories: [],
      },
    };
  }
};
