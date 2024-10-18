// src/pages/ProductsPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/actions/productActions';
import ProductList from '../components/ProductList';

const ProductsPage = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <h1>Productos</h1>
            <ProductList products={products} />
        </div>
    );
};

export default ProductsPage;

// Explicación detallada
// dispatch:
// dispatch es una función proporcionada por el hook useDispatch de react-redux.
// Su principal función es enviar acciones a la tienda de Redux para modificar el estado global de la aplicación.
// Al llamar a dispatch(fetchProducts()), estamos diciendo que queremos ejecutar la acción fetchProducts, la cual a su vez probablemente va a realizar una llamada a una API para obtener datos y actualizar el estado con esos productos.

// useSelector:
// useSelector es un hook que permite acceder al estado de la tienda de Redux.
// Uso de useSelector:
// Cuando usas useSelector en tu componente (por ejemplo, en ProductsPage), estás extrayendo datos específicos del "store".
// En el código const products = useSelector((state) => state.products.products);, lo que haces es acceder a:
// state: El estado global del store.
// state.products: La parte del estado relacionada con los productos, que se obtiene del productReducer.
// state.products.products: Finalmente, accedes al array de productos almacenados en la propiedad products de products.
// const products = useSelector((myState) => myState.products.products); 
// Al usar este hook, el componente se volverá a renderizar automáticamente cada vez que la parte del estado que estamos seleccionando cambie.

// useEffect y fetchProducts:
// useEffect es un hook que permite manejar efectos secundarios en componentes funcionales. En este caso, se utiliza para realizar una acción (fetch de productos) cuando el componente se monta.
// fetchProducts es una acción que se supone que realiza una solicitud a una API para obtener la lista de productos. Esta función será asíncrona y posiblemente devolverá una acción con el tipo correspondiente y los datos obtenidos, que luego será manejada por un reducer para actualizar el estado en Redux.
// El arreglo de dependencias [dispatch] asegura que useEffect solo se ejecute una vez al montar el componente, porque dispatch no cambia, previniendo llamadas innecesarias a la API.



