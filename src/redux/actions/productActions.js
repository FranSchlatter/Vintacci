// src/redux/actions/productActions.js
import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/products');
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: response.data });
    } catch (error) {
        console.error("Error fetching products:", error);
        dispatch({ type: 'FETCH_PRODUCTS_FAILURE', payload: error });
    }
};
