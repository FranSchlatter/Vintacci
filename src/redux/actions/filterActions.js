// src/redux/actions/filterActions.js
export const setActiveFilters = (filters) => ({
  type: 'SET_ACTIVE_FILTERS',
  payload: filters
});

export const updateFilter = (filterType, value, isChecked) => ({
  type: 'UPDATE_FILTER',
  payload: { filterType, value, isChecked }
});

export const updatePriceRange = (min, max) => ({
  type: 'UPDATE_PRICE_RANGE',
  payload: { min, max }
});

export const removeFilter = (filterType, value) => ({
  type: 'REMOVE_FILTER',
  payload: { filterType, value }
});

export const setSortBy = (sortBy) => ({
  type: 'SET_SORT_BY',
  payload: sortBy
});