// src/redux/actions/tagActions.js
import axios from 'axios';

export const fetchTags = () => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_TAGS_REQUEST' });
        const response = await axios.get('http://localhost:5000/tags');
        dispatch({ type: 'FETCH_TAGS_SUCCESS', payload: response.data });
    } catch (error) {
        console.error("Error fetching tags:", error);
        dispatch({ type: 'FETCH_TAGS_FAILURE', payload: error.message });
    }
};

export const addTag = (tagData) => async (dispatch) => {
    try {
        dispatch({ type: 'ADD_TAG_REQUEST' });
        const response = await axios.post('http://localhost:5000/tags', tagData);
        dispatch({ type: 'ADD_TAG_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error adding tag:', error);
        dispatch({ type: 'ADD_TAG_FAILURE', payload: error.message });
        throw error;
    }
};

export const updateTag = (id, tagData) => async (dispatch) => {
    try {
        dispatch({ type: 'UPDATE_TAG_REQUEST' });
        const response = await axios.put(`http://localhost:5000/tags/${id}`, tagData);
        dispatch({ type: 'UPDATE_TAG_SUCCESS', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error updating tag:', error);
        dispatch({ type: 'UPDATE_TAG_FAILURE', payload: error.message });
        throw error;
    }
};

export const deleteTag = (id) => async (dispatch) => {
    try {
        dispatch({ type: 'DELETE_TAG_REQUEST' });
        await axios.delete(`http://localhost:5000/tags/${id}`);
        dispatch({ type: 'DELETE_TAG_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting tag:', error);
        dispatch({ type: 'DELETE_TAG_FAILURE', payload: error.message });
        throw error;
    }
};

