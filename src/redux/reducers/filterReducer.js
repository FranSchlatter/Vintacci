// src/redux/reducers/filterReducer.js
const initialState = {
  activeFilters: {
      category: [], // Solo categorías y subcategorías
      tags: [], // Tags del producto
      priceRange: { min: 0, max: 999999 }
  },
  sortBy: 'newest' // Mantenemos el ordenamiento
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'SET_ACTIVE_FILTERS':
          return {
              ...state,
              activeFilters: action.payload
          };
      case 'UPDATE_FILTER':
          const { filterType, value, isChecked } = action.payload;
          return {
              ...state,
              activeFilters: {
                  ...state.activeFilters,
                  [filterType]: isChecked
                      ? [...state.activeFilters[filterType], value]
                      : state.activeFilters[filterType].filter(v => v !== value)
              }
          };
      case 'UPDATE_PRICE_RANGE':
          return {
              ...state,
              activeFilters: {
                  ...state.activeFilters,
                  priceRange: action.payload
              }
          };
      case 'REMOVE_FILTER':
          const { filterType: removeType, value: removeValue } = action.payload;
          return {
              ...state,
              activeFilters: {
                  ...state.activeFilters,
                  [removeType]: removeType === 'priceRange'
                      ? { min: 0, max: 999999 }
                      : state.activeFilters[removeType].filter(v => v !== removeValue)
              }
          };
      case 'SET_SORT_BY':
          return {
              ...state,
              sortBy: action.payload
          };
      default:
          return state;
  }
};

export default filterReducer;
