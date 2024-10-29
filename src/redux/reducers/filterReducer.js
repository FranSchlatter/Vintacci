// src/redux/reducers/filterReducer.js
const initialState = {
    activeFilters: {
      category: [],
      brand: [],
      style: [],
      era: [],
      size: [],
      sex: [],
      color: [],
      material: [],
      priceRange: { min: 0, max: 999999 }
    },
    searchQuery: '',
    sortBy: 'newest'
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
            priceRange: { min: action.payload.min, max: action.payload.max }
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
      case 'SET_SEARCH_QUERY':
        return {
          ...state,
          searchQuery: action.payload
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
