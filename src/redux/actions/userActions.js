import axios from 'axios';

// Acción para obtener usuarios
export const fetchUsers = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:5000/users');
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error fetching users:', error);
        dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
    }
};

// Acción para agregar un nuevo usuario
export const addUser = (user) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:5000/users', user);
        dispatch({ type: 'ADD_USER_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error adding user:', error);
        dispatch({ type: 'ADD_USER_FAILURE', payload: error.message });
    }
};

// Acción para actualizar un usuario existente
export const updateUser = (id, user) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/users/${id}`, user);
        dispatch({ type: 'UPDATE_USER_SUCCESS', payload: response.data });
    } catch (error) {
        console.error('Error updating user:', error);
        dispatch({ type: 'UPDATE_USER_FAILURE', payload: error.message });
    }
};

// Acción para eliminar un usuario
export const deleteUser = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        dispatch({ type: 'DELETE_USER_SUCCESS', payload: id });
    } catch (error) {
        console.error('Error deleting user:', error);
        dispatch({ type: 'DELETE_USER_FAILURE', payload: error.message });
    }
};
