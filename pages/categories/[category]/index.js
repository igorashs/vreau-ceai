import { withCategoryStoreLayout } from '@/layouts/StoreLayout';
import Head from 'next/head';
import styled from 'styled-components';
import CategoryModel from '@/models/Category';
import Product from '@/models/Product';
import dbConnect from '@/utils/dbConnect';
import { TeaCard } from '@/shared/TeaCard';
import breakpoints from 'GlobalStyle/breakpoints';
import { Filter } from '@/shared/Filter';
import { DropDownList } from '@/shared/DropDownList';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { StaticPagination } from '@/shared/StaticPagination';

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
    value: 'ascPrice'
  },
  {
    text: 'Preț descrescător',
    value: 'descPrice'
  }
];

const PRODUCTS_PER_PAGE = 3;

export default function Category({ category, currPage, totalPages, products }) {
  const router = useRouter();
  const [filters, setFilters] = useState(new Set());

  useEffect(() => {
    setFilters(() => {
      if (router.query.filters) {
        return new Set(router.query.filters.split(' '));
      }

      return new Set();
    });
  }, [category]);

  const handlePageChange = (page) => {
    if (!router.query.page && page === 0) return;
    if (router.query.page && +router.query.page === page + 1) return;

    const query = {};

    if (router.query.filters) query.filters = router.query.filters;
    query.page = page + 1;

    router.replace({
      pathname: `/categories/${category}`,
      query
    });
  };

  const handleFilterChange = (filter) => {
    setFilters((e) => {
      const filters = new Set(e);

      if (filters.has(filter)) {
        filters.delete(filter);
      } else {
        filters.add(filter);
      }

      let query = {};

      if (filters.size) {
        query.filters = [...filters].join(' ');
      }

      router.replace({
        pathname: `/categories/${category}`,
        query
      });

      return filters;
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
              id={f.value}
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
        <StaticPagination
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

export const getServerSideProps = async ({ query }) => {
  await dbConnect();

  try {
    const { category, page = 1, filters: filtersQuery } = query;
    let sortFilter = {};

    if (filtersQuery) {
      const filters = Object.fromEntries(
        filtersQuery.split(' ').map((f) => [f, true])
      );

      if (filters.ascPrice) sortFilter.price = 1;
      else if (filters.descPrice) sortFilter.price = -1;
    }

    const dbCategory = await CategoryModel.findOne({ name: category })
      .populate({
        path: 'products',
        options: {
          limit: PRODUCTS_PER_PAGE,
          skip: PRODUCTS_PER_PAGE * (page - 1),
          sort: sortFilter
        }
      })
      .lean();

    if (!dbCategory || !dbCategory.products.length) {
      return {
        notFound: true
      };
    }

    const count = await Product.countDocuments({
      category_id: dbCategory._id
    });

    const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE);

    return {
      props: {
        category,
        currPage: page,
        totalPages,
        products: JSON.parse(JSON.stringify(dbCategory.products))
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};
