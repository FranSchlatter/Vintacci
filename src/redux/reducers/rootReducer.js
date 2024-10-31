// src/redux/reducers/rootReducer.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import userReducer from './userReducer';
import filterReducer from './filterReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';

const rootReducer = combineReducers({
    products: productReducer,
    users: userReducer,
    filters: filterReducer,
    orders: orderReducer,
    cart: cartReducer
});

export default rootReducer;

// Resumen
// Este archivo define el rootReducer, que combina todos los reducers de la aplicación en un solo reducer.
// La función combineReducers permite gestionar el estado de manera estructurada, donde cada reducer maneja una parte específica del estado global.
// En este caso, el estado de los productos se gestiona a través de productReducer, y será accesible en el estado global de la aplicación bajo la clave products.


