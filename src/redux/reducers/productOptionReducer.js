// src/redux/reducers/productOptionReducer.js
const initialState = {
    options: [],
    optionsByType: {},
    loading: false,
    error: null,
    success: false
};

const productOptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_OPTIONS_REQUEST':
        case 'FETCH_OPTIONS_BY_TYPE_REQUEST':
        case 'ADD_OPTION_REQUEST':
        case 'UPDATE_OPTION_REQUEST':
        case 'DELETE_OPTION_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
        
        case 'FETCH_OPTIONS_SUCCESS':
            return {
                ...state,
                options: action.payload,
                loading: false,
                error: null,
                success: true
            };

        case 'FETCH_OPTIONS_BY_TYPE_SUCCESS':
            return {
                ...state,
                optionsByType: {
                    ...state.optionsByType,
                    [action.payload.type]: action.payload.options
                },
                loading: false,
                error: null,
                success: true
            };

        case 'ADD_OPTION_SUCCESS':
            return {
                ...state,
                options: [...state.options, action.payload],
                loading: false,
                error: null,
                success: true
            };

        case 'UPDATE_OPTION_SUCCESS':
            return {
                ...state,
                options: state.options.map(option =>
                    option.id === action.payload.id ? action.payload : option
                ),
                loading: false,
                error: null,
                success: true
            };

        case 'DELETE_OPTION_SUCCESS':
            return {
                ...state,
                options: state.options.filter(option => option.id !== action.payload),
                loading: false,
                error: null,
                success: true
            };

        case 'FETCH_OPTIONS_FAILURE':
        case 'FETCH_OPTIONS_BY_TYPE_FAILURE':
        case 'ADD_OPTION_FAILURE':
        case 'UPDATE_OPTION_FAILURE':
        case 'DELETE_OPTION_FAILURE':
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

export default productOptionReducer;
