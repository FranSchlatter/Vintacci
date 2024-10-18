import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Importación correcta
import rootReducer from './reducers/rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk)); // Usar thunk directamente

export { store };
