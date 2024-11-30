// src/redux/actions/categoryActions.js
import axios from 'axios';

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        const response = await axios.get('http://localhost:5000/categories');
        dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: response.data });
    } catch (error) {
        console.error("Error fetching categories:", error);
        dispatch({ type: 'FETCH_CATEGORIES_FAILURE', payload: error.message });
    }
};

export const addCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: 'ADD_CATEGORY_REQUEST' });
        const response = await axios.post('http://localhost:5000/categories', categoryData);
        dispatch({ type: 'ADD_CATEGORY_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error);
        dispatch({ type: 'ADD_CATEGORY_FAILURE', payload: error.message });
        throw error;
    }
};

export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {
        dispatch({ type: 'UPDATE_CATEGORY_REQUEST' });
        const response = await axios.put(`http://localhost:5000/categories/${id}`, categoryData);
        dispatch({ type: 'UPDATE_CATEGORY_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        dispatch({ type: 'UPDATE_CATEGORY_FAILURE', payload: error.message });
        throw error;
    }
};

export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'DELETE_CATEGORY_REQUEST' });
        await axios.delete(`http://localhost:5000/categories/${id}`);
        dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting category:', error);
        dispatch({ type: 'DELETE_CATEGORY_FAILURE', payload: error.message });
        throw error;
    }
};

