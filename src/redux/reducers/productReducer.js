// src/redux/reducers/productReducer.js
const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'ADD_PRODUCT_SUCCESS':
            return { ...state, products: [...state.products, action.payload], loading: false };
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                loading: false,
            };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                products: state.products.filter((product) => product.id !== action.payload),  // Filtrar el producto eliminado
            };
        case 'DELETE_PRODUCT_FAILURE':
            return { ...state, error: action.payload };
        case 'FETCH_PRODUCTS_FAILURE':
            return { ...state, error: action.payload };
        case 'ADD_PRODUCT_FAILURE':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default productReducer;


// Explicación Detallada
// Estado Inicial:

// const initialState = { ... }:
// Se define un objeto initialState que representa el estado inicial del reducer.
// Contiene tres propiedades:
// products: un arreglo vacío que almacenará los productos.
// loading: un booleano que indica si los productos están siendo cargados; inicialmente es false.
// error: se inicia como null y se utilizará para almacenar cualquier error que ocurra al intentar cargar productos.

// Definición del Reducer:
// const productReducer = (state = initialState, action) => { ... }:
// Aquí se define el reducer productReducer, que toma dos parámetros:
// state: el estado actual (con un valor por defecto de initialState).
// action: un objeto que describe la acción que se va a manejar.
// El reducer es responsable de actualizar el estado de la aplicación en respuesta a las acciones que se despachan.

// Manejo de Acciones:
// switch (action.type) { ... }:
// Se utiliza una declaración switch para manejar diferentes tipos de acciones.
// Caso de Éxito:
// case 'FETCH_PRODUCTS_SUCCESS':: Si se recibe una acción de éxito al obtener productos.
// return { ...state, products: action.payload, loading: false };:
// Se retorna un nuevo estado que combina el estado anterior (...state) y actualiza la propiedad products con el payload de la acción (que contiene los productos obtenidos).
// Se establece loading a false ya que la carga se ha completado.
// default:: Si el tipo de acción no coincide con los casos anteriores.
// return state;: Se retorna el estado actual sin cambios, lo que es importante para mantener el estado si no se han hecho actualizaciones.

// Exportación:
// Se exporta el reducer para que pueda ser utilizado en la configuración del store de Redux.

// Resumen
// Este archivo define un reducer que maneja el estado relacionado con los productos de la tienda vintage.
// Administra el estado de la lista de productos, un estado de carga y cualquier error que pueda ocurrir durante la obtención de los productos.
// Al despachar acciones desde los componentes (como FETCH_PRODUCTS_SUCCESS o FETCH_PRODUCTS_FAILURE), el reducer actualizará el estado global de la aplicación, permitiendo a los componentes reactivos reflejar estos cambios.