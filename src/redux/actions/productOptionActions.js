// src/redux/actions/productOptionActions.js
import axios from 'axios';

export const fetchOptions = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_OPTIONS_REQUEST' });
        const response = await axios.get('http://localhost:5000/product-options');
        dispatch({ type: 'FETCH_OPTIONS_SUCCESS', payload: response.data });
    } catch (error) {
        console.error("Error fetching options:", error);
        dispatch({ type: 'FETCH_OPTIONS_FAILURE', payload: error.message });
    }
};

export const fetchOptionsByType = (type) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_OPTIONS_BY_TYPE_REQUEST' });
        const response = await axios.get(`http://localhost:5000/product-options/type/${type}`);
        dispatch({ type: 'FETCH_OPTIONS_BY_TYPE_SUCCESS', payload: { type, options: response.data } });
    } catch (error) {
        console.error("Error fetching options by type:", error);
        dispatch({ type: 'FETCH_OPTIONS_BY_TYPE_FAILURE', payload: error.message });
    }
};

export const addOption = (optionData) => async (dispatch) => {
    try {
        dispatch({ type: 'ADD_OPTION_REQUEST' });
        const response = await axios.post('http://localhost:5000/product-options', optionData);
        dispatch({ type: 'ADD_OPTION_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error adding option:', error);
        dispatch({ type: 'ADD_OPTION_FAILURE', payload: error.message });
        throw error;
    }
};

export const updateOption = (id, optionData) => async (dispatch) => {
    try {
        dispatch({ type: 'UPDATE_OPTION_REQUEST' });
        const response = await axios.put(`http://localhost:5000/product-options/${id}`, optionData);
        dispatch({ type: 'UPDATE_OPTION_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error updating option:', error);
        dispatch({ type: 'UPDATE_OPTION_FAILURE', payload: error.message });
        throw error;
    }
};

export const deleteOption = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'DELETE_OPTION_REQUEST' });
        await axios.delete(`http://localhost:5000/product-options/${id}`);
        dispatch({ type: 'DELETE_OPTION_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting option:', error);
        dispatch({ type: 'DELETE_OPTION_FAILURE', payload: error.message });
        throw error;
    }
};