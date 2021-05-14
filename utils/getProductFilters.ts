import { ProductMatchFilter, ProductSortFilter } from 'types';

// returns matchFilter - which product to query (matching recommended)
// returns sortFilter - how to sort orders
const getProductFilters = (filtersQuery: string) => {
  const matchFilter: ProductMatchFilter = {};
  const sortFilter: ProductSortFilter = {};

  if (filtersQuery) {
    // converts all existing string values to boolean
    const filters = Object.fromEntries(
      filtersQuery.split(' ').map((f) => [f, true]),
    );

    // add matched filter if exists
    if (filters.recommend) matchFilter.recommend = true;

    // set price sort filter
    if (filters.ascPrice) sortFilter.price = 1;
    else if (filters.descPrice) sortFilter.price = -1;

    // set total_quantity sort filter
    if (filters.ascQuantity) sortFilter.total_quantity = 1;
    else if (filters.descQuantity) sortFilter.total_quantity = -1;
  }

  return { matchFilter, sortFilter };
};

export default getProductFilters;
