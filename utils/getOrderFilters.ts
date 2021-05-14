import { OrderMatchFilter, OrderSortFilter } from 'types';

// returns matchFilter - which orders to query (matching status)
// returns sortFilter - how to sort orders
const getOrderFilters = (filtersQuery: string) => {
  const matchFilter: OrderMatchFilter = {
    status: [],
  };
  const sortFilter: OrderSortFilter = {};

  if (filtersQuery) {
    // converts all existing string values to boolean
    const filters = Object.fromEntries(
      filtersQuery.split(' ').map((f) => [f, true]),
    );

    // add matched filter if exists
    if (filters.processing) matchFilter.status.push('processing');
    if (filters.inDelivery) matchFilter.status.push('inDelivery');
    if (filters.canceled) matchFilter.status.push('canceled');
    if (filters.completed) matchFilter.status.push('completed');

    // set sort filter
    if (filters.lastOrdered) sortFilter.orderedAt = -1;
    else if (filters.firstOrdered) sortFilter.orderedAt = 1;
  }

  // match every status if none was selected
  if (!matchFilter.status.length)
    matchFilter.status = ['processing', 'inDelivery', 'completed', 'canceled'];

  return {
    matchFilter,
    sortFilter,
  };
};

export default getOrderFilters;
