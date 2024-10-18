import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Función para obtener productos
export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

// Función para agregar un nuevo producto
export const addProduct = async (product) => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
};

// Función para obtener usuarios
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

// Función para registrar un nuevo usuario
export const registerUser = async (user) => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
};
