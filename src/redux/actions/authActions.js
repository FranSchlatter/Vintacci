import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchUserFavorites } from './favoriteActions';

export const loginUser = (credentials) => async (dispatch) => {
    try {
        const { data: { token, user } } = await axios.post('http://localhost:5000/auth/login', credentials);
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        dispatch(fetchUserFavorites(user.id));
        
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        const { data } = await axios.post('http://localhost:5000/auth/register', userData);
        await axios.post('http://localhost:5000/email/welcome', data.user);
        toast.success('Registro exitoso. Por favor, inicia sesión.');
        return data;
    } catch (error) {
        console.error('Register error:', error);
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
    if (!token) return dispatch({ type: 'LOGOUT' });

    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data: user } = await axios.get('http://localhost:5000/auth/me');
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        dispatch(fetchUserFavorites(user.id));
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
    }
};