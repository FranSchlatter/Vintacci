// src/redux/actions/favoriteActions.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchUserFavorites = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/favorites/user/${userId}`);
        // Asegurarnos que cada item tenga product_id
        const formattedFavorites = response.data.map(favorite => ({
            ...favorite,
            product_id: favorite.id // Asegurarnos que tengamos product_id
        }));
        dispatch({ type: 'FETCH_FAVORITES', payload: formattedFavorites });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Error al cargar favoritos');
    }
};

// Modificar addToFavorites para manejar mejor la respuesta
export const addToFavorites = (userId, productId) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:5000/favorites/user/${userId}/product/${productId}`);
        
        // Asegurarnos que la estructura sea consistente
        const favoriteData = {
            ...response.data,
            product_id: response.data.product_id || productId
        };
        
        dispatch({ 
            type: 'ADD_TO_FAVORITES', 
            payload: favoriteData
        });
        toast.success('Agregado a favoritos');
    } catch (error) {
        if (error.response?.status === 400) {
            // Si ya existe, no mostramos error pero actualizamos el estado
            dispatch(fetchUserFavorites(userId));
        } else {
            toast.error('Error al agregar a favoritos');
        }
        throw error;
    }
};

export const removeFromFavorites = (userId, productId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/favorites/user/${userId}/product/${productId}`);
        dispatch({ 
            type: 'REMOVE_FROM_FAVORITES', 
            payload: productId 
        });
        toast.success('Eliminado de favoritos');
    } catch (error) {
        console.error('Error removing from favorites:', error);
        // Si el favorito no existe (404), igual actualizamos el estado
        if (error.response?.status === 404) {
            dispatch({ 
                type: 'REMOVE_FROM_FAVORITES', 
                payload: productId 
            });
        } else {
            toast.error('Error al eliminar de favoritos');
        }
        throw error;
    }
};

