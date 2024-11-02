// src/redux/actions/favoriteActions.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchUserFavorites = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/favorites/user/${userId}`);
        dispatch({ type: 'FETCH_FAVORITES', payload: response.data });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Error al cargar favoritos');
    }
};

export const addToFavorites = (userId, productId) => async (dispatch) => {
    try {
        await axios.post(`http://localhost:5000/favorites/user/${userId}/product/${productId}`);
        dispatch({ type: 'ADD_TO_FAVORITES', payload: productId });
        toast.success('Agregado a favoritos');
    } catch (error) {
        console.error('Error adding to favorites:', error);
        toast.error('Error al agregar a favoritos');
    }
};

export const removeFromFavorites = (userId, productId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/favorites/user/${userId}/product/${productId}`);
        dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
        toast.success('Eliminado de favoritos');
    } catch (error) {
        console.error('Error removing from favorites:', error);
        toast.error('Error al eliminar de favoritos');
    }
};