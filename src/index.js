// src/index.js o src/App.js
import './index.css'; // Asegúrate de que la ruta sea correcta
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>  {/* Asegúrate de envolver tu App con el Provider */}
    <App />
  </Provider>
);