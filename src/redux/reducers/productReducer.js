// src/redux/reducers/productReducer.js
const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_PRODUCTS_FAILURE':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export default productReducer;
