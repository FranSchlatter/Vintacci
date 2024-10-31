// src/redux/actions/productActions.js
import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/products');
        dispatch({ type: 'FETCH_PRODUCTS', payload: response.data });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}; 

export const addProduct = (productData) => async (dispatch) => {
    try {
        console.log(productData)
        const response = await axios.post('http://localhost:5000/products', productData);
        dispatch({ type: 'ADD_PRODUCT', payload: response.data });
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/products/${id}`, productData);
        dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        dispatch({ type: 'DELETE_PRODUCT', payload: id });  // Enviar el ID al reducer
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

export const fetchProductId = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        dispatch({ type: 'FETCH_PRODUCT_ID', payload: response.data });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};