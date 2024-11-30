// src/redux/reducers/categoryReducer.js
const initialState = {
    categories: [],
    loading: false,
    error: null,
    success: false
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_REQUEST':
        case 'ADD_CATEGORY_REQUEST':
        case 'UPDATE_CATEGORY_REQUEST':
        case 'DELETE_CATEGORY_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        
        case 'FETCH_CATEGORIES_SUCCESS':
            return {
                ...state,
                categories: action.payload,
                loading: false,
                error: null,
                success: true
            };

        case 'ADD_CATEGORY_SUCCESS':
            return {
                ...state,
                categories: [...state.categories, action.payload],
                loading: false,
                error: null,
                success: true
            };

        case 'UPDATE_CATEGORY_SUCCESS':
            return {
                ...state,
                categories: state.categories.map(category =>
                    category.id === action.payload.id ? action.payload : category
                ),
                loading: false,
                error: null,
                success: true
            };

        case 'DELETE_CATEGORY_SUCCESS':
            return {
                ...state,
                categories: state.categories.filter(category => category.id !== action.payload),
                loading: false,
                error: null,
                success: true
            };

        case 'FETCH_CATEGORIES_FAILURE':
        case 'ADD_CATEGORY_FAILURE':
        case 'UPDATE_CATEGORY_FAILURE':
        case 'DELETE_CATEGORY_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        default:
            return state;
    }
};

export default categoryReducer;