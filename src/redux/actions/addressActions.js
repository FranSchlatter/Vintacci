// src/redux/actions/addressActions.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchUserAddresses = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/address/user/${userId}`);
        dispatch({ type: 'FETCH_USER_ADDRESSES', payload: response.data });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Error al cargar las direcciones');
    }
};

export const addAddress = (userId, addressData) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:5000/address/user/${userId}`, addressData);
        dispatch({ type: 'ADD_ADDRESS', payload: response.data });
        toast.success('Dirección agregada con éxito');
        return response.data;
    } catch (error) {
        console.error('Error adding address:', error);
        toast.error('Error al agregar la dirección');
        throw error;
    }
};

export const updateAddress = (addressId, addressData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/address/${addressId}`, addressData);
        dispatch({ type: 'UPDATE_ADDRESS', payload: response.data });
        toast.success('Dirección actualizada con éxito');
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        toast.error('Error al actualizar la dirección');
        throw error;
    }
};

export const deleteAddress = (addressId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/address/${addressId}`);
        dispatch({ type: 'DELETE_ADDRESS', payload: addressId });
        toast.success('Dirección eliminada con éxito');
    } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Error al eliminar la dirección');
        throw error;
    }
};

export const setDefaultAddress = (addressId, userId) => async (dispatch) => {
    try {
        const response = await axios.patch(`http://localhost:5000/address/${addressId}/default/${userId}`);
        dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: response.data });
        toast.success('Dirección predeterminada actualizada');
        return response.data;
    } catch (error) {
        console.error('Error setting default address:', error);
        toast.error('Error al establecer la dirección predeterminada');
        throw error;
    }
};