// src/redux/actions/authActions.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/login', credentials);
        const { token, user } = response.data;
        
        // Guardar token en localStorage
        localStorage.setItem('token', token);
        
        // Configurar token para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return user;
    } catch (error) {
        dispatch({ type: 'LOGIN_FAIL' });
        throw error;
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', userData);
        toast.success('Registro exitoso. Por favor, inicia sesión.');
        return response.data;
    } catch (error) {
        dispatch({ type: 'REGISTER_FAIL' });
        throw error;
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
};

export const checkAuth = () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return dispatch({ type: 'LOGOUT' });
    }

    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://localhost:5000/auth/me');
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
    }
};