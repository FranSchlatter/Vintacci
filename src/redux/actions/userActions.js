import axios from 'axios';

// Acción para obtener usuarios
export const fetchUsers = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/users');
        dispatch({ type: 'FETCH_USERS', payload: response.data });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Acción para agregar un nuevo usuario
export const addUser = (user) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/users', user);
        dispatch({ type: 'ADD_USER', payload: response.data });
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

// Acción para actualizar un usuario existente
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/users/${id}`, userData);
        dispatch({ type: 'UPDATE_USER', payload: response.data });
        // Añadir esta línea para actualizar también el estado de auth
        dispatch({ type: 'UPDATE_CURRENT_USER', payload: response.data });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error; // Importante lanzar el error para manejarlo en el componente
    }
};

// Acción para eliminar un usuario
export const deleteUser = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        dispatch({ type: 'DELETE_USER', payload: id });
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Accion para traer user por id
export const fetchUserById = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        dispatch({ type: 'FETCH_USER_ID', payload: response.data });
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
