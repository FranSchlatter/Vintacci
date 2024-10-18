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

// const root = ReactDOM.createRoot(document.getElementById('root'));: Crea un root que se vincula con el elemento del DOM que tiene el id root, donde se renderizará la aplicación.
// root.render(: Método que inicia el proceso de renderizado de la aplicación dentro del elemento especificado.
// <Provider store={store}>: Envuelve la aplicación en el componente Provider, lo que permite que todos los componentes dentro de App accedan al store de Redux y su estado. Esto es fundamental para que la gestión del estado global funcione correctamente.
// <App />: Renderiza el componente App, que a su vez contiene el enrutamiento y la lógica de la aplicación.