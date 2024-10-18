// src/redux/reducers/rootReducer.js
import { combineReducers } from 'redux';
import productReducer from './productReducer'; // Asegúrate de que la ruta es correcta

const rootReducer = combineReducers({
    products: productReducer, // Cambia aquí si tienes un nombre diferente
});

export default rootReducer;
