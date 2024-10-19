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

export const addProduct = (productData) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/products', productData);
        dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/products/${id}`, productData);
        dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });  // Enviar el ID al reducer
    } catch (error) {
        console.error('Error deleting product:', error);
        dispatch({ type: 'DELETE_PRODUCT_FAILURE', payload: error });
    }
};




// dispatch es una función proporcionada por Redux que se utiliza para enviar acciones al store.
// Si la solicitud es exitosa, se despacha una acción con un tipo 'FETCH_PRODUCTS_SUCCESS' y el payload contiene los datos obtenidos de la respuesta (response.data).

// Resumen
// Este archivo define una acción asíncrona (fetchProducts) que se encarga de obtener la lista de productos desde un API.
// Utiliza Axios para realizar la solicitud y despacha acciones basadas en si la solicitud fue exitosa o fallida, lo que permite a la aplicación manejar la lógica de estado de Redux de manera efectiva.

// dispatch es una función proporcionada por Redux que se utiliza para enviar acciones al store.
// Si la solicitud es exitosa, se despacha una acción con un tipo 'FETCH_PRODUCTS_SUCCESS' y el payload contiene los datos obtenidos de la respuesta (response.data).

// Resumen
// Este archivo define una acción asíncrona (fetchProducts) que se encarga de obtener la lista de productos desde un API.
// Utiliza Axios para realizar la solicitud y despacha acciones basadas en si la solicitud fue exitosa o fallida, lo que permite a la aplicación manejar la lógica de estado de Redux de manera efectiva.