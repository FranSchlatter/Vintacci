import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Importación correcta
import rootReducer from './reducers/rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk)); // Usar thunk directamente

export { store };

// Explicación Detallada
// Importación de Dependencias:

// import { createStore, applyMiddleware } from 'redux';:
// Se importan dos funciones de Redux:
// createStore: Se utiliza para crear el store de Redux, que es el objeto que almacena el estado de la aplicación.
// applyMiddleware: Se utiliza para aplicar middleware al store. El middleware permite extender la funcionalidad del store, como manejar acciones asíncronas.
// import { thunk } from 'redux-thunk';:
// Se importa thunk, que es un middleware que permite que las acciones de Redux sean funciones en lugar de objetos. Esto es útil para manejar operaciones asíncronas, como llamadas a APIs.
// import rootReducer from './reducers/rootReducer';:
// Se importa el rootReducer, que combina todos los reducers de la aplicación en un solo reducer. Esto define la estructura del estado global.

// Creación del Store:
// const store = createStore(rootReducer, applyMiddleware(thunk));:
// Se crea el store de Redux usando createStore.
// rootReducer se pasa como primer argumento, definiendo la lógica para manejar el estado global.
// applyMiddleware(thunk) se pasa como segundo argumento, aplicando el middleware thunk. Esto permite manejar acciones que pueden ser asíncronas, como las que involucran solicitudes a APIs.
// Exportación:

// export { store };:
// Se exporta el store, lo que permite que otras partes de la aplicación, como componentes o middleware, accedan a él y se suscriban a los cambios en el estado.

// Resumen
// Este archivo configura el store de Redux, que es esencial para gestionar el estado global de la aplicación.
// Utiliza el rootReducer para definir cómo se manejará el estado y aplica el middleware thunk para permitir acciones asíncronas.
// Al exportar el store, se facilita su uso en toda la aplicación, permitiendo a los componentes acceder al estado y despachar acciones.