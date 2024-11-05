// src/redux/reducers/rootReducer.js
import { combineReducers } from 'redux';
import productReducer from './productReducer';
import userReducer from './userReducer';
import filterReducer from './filterReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';
import addressReducer from './addressReducer';
import authReducer from './authReducer';
import favoriteReducer from './favoriteReducer';

const rootReducer = combineReducers({
    products: productReducer,
    users: userReducer,
    filters: filterReducer,
    orders: orderReducer,
    favorites: favoriteReducer,
    addresses: addressReducer,
    auth: authReducer,
    cart: cartReducer
});

export default rootReducer;