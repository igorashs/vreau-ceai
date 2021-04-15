import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import Head from 'next/head';
import styled from 'styled-components';
import CategoryModel, {
  Category as CategoryModelType,
} from '@/models/Category';
import ProductModel from '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import TeaCard from '@/shared/TeaCard';
import breakpoints from 'GlobalStyle/breakpoints';
import Filter from '@/shared/Filter';
import DropDownList from '@/shared/DropDownList';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@/shared/Pagination';
import { GetServerSideProps } from 'next';
import { Product } from 'types';
import { getQueryElements } from '@/utils/getQueryElements';

const List = styled.ul`
  margin: var(--baseline) 0;
  display: grid;
  justify-content: center;
  gap: var(--baseline);
  grid-template-columns: repeat(auto-fit, 252px);

  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: calc(var(--baseline) * 2);
    justify-content: start;
  }
`;

const allowedFilters = [
  {
    text: 'Preț crescător',
    value: 'ascPrice',
  },
  {
    text: 'Preț descrescător',
    value: 'descPrice',
  },
];

const PRODUCTS_PER_PAGE = 3;

type CategoryProps = {
  category: string;
  currPage: number;
  totalPages: number;
  products: Product[];
};

export default function Category({
  category,
  currPage,
  totalPages,
  products,
}: CategoryProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(new Set<string>());

  useEffect(() => {
    setFilters(() => {
      const { filters: queryFilters } = getQueryElements(router.query);

      if (queryFilters) {
        return new Set(queryFilters.split(' '));
      }

      return new Set();
    });
  }, [category]);

  const handlePageChange = (page: number) => {
    if (!router.query.page && page === 0) return;
    if (router.query.page && +router.query.page === page + 1) return;

    const query: { [key: string]: string | string[] } = {};

    if (router.query.filters) query.filters = router.query.filters;
    query.page = (page + 1).toString();

    router.replace({
      pathname: `/categories/${category}`,
      query,
    });
  };

  const handleFilterChange = (filter: string) => {
    setFilters((e) => {
      const newFilters = new Set(e);

      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }

      const query: { [key: string]: string | string[] } = {};

      if (newFilters.size) {
        query.filters = [...newFilters].join(' ');
      }

      router.replace({
        pathname: `/categories/${category}`,
        query,
      });

      return newFilters;
    });
  };

  return (
    <>
      <Head>
        <title>Categorie: {category}</title>
        <meta
          name="description"
          content={`Ceaiuri din categoria: ${category}`}
        />
      </Head>

      <DropDownList label="Filtre">
        {allowedFilters.map((f) => (
          <li key={f.value}>
            <Filter
              text={f.text}
              checked={filters.has(f.value)}
              onChange={() => handleFilterChange(f.value)}
            />
          </li>
        ))}
      </DropDownList>

      <List>
        {products.map((p) => (
          <li key={p._id}>
            <TeaCard tea={p} category={category} />
          </li>
        ))}
      </List>

      {totalPages && (
        <Pagination
          onPageChange={handlePageChange}
          currPage={currPage - 1}
          min={0}
          max={totalPages - 1}
        />
      )}
    </>
  );
}

Category.withLayout = withCategoryStoreLayout;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  await dbConnect();

  try {
    const { category, page = 1, filters: queryFilters } = getQueryElements(
      query,
    );
    const sortFilter: { price?: 1 | -1 } = {};

    if (queryFilters) {
      const filters = Object.fromEntries(
        queryFilters.split(' ').map((f) => [f, true]),
      );

      if (filters.ascPrice) sortFilter.price = 1;
      else if (filters.descPrice) sortFilter.price = -1;
    }

    const dbCategory: CategoryModelType = await CategoryModel.findOne({
      name: category,
    })
      .populate({
        path: 'products',
        options: {
          limit: PRODUCTS_PER_PAGE,
          skip: PRODUCTS_PER_PAGE * (+page - 1),
          sort: sortFilter,
        },
      })
      .lean();

    if (!dbCategory || !dbCategory.products.length) {
      return {
        notFound: true,
      };
    }

    const count: number = await ProductModel.countDocuments({
      category_id: dbCategory._id,
    });

    const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);

    return {
      props: {
        category,
        currPage: page,
        totalPages,
        products: JSON.parse(JSON.stringify(dbCategory.products)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
