// src/redux/reducers/productReducer.js
const initialState = {
    allProducts: [],
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS':
            return { ...state, allProducts: action.payload, loading: false };
        case 'ADD_PRODUCT':
            return { ...state, allProducts: [...state.allProducts, action.payload], loading: false };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                allProducts: state.allProducts.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                loading: false,
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                allProducts: state.allProducts.filter((product) => product.id !== action.payload),
            };
        case 'FETCH_PRODUCT_ID':
            return { ...state, idProduct: action.payload, loading: false };
        default:
            return state;
    }
};

export default productReducer;