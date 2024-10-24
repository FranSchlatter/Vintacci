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
        <div className="vintage-bg min-h-screen py-10">
            <div className="container mx-auto px-6 font-vintage">
                <h1 className="text-4xl font-bold text-center mb-10 text-vintage-accent">Nuestros Productos</h1>
                {/* Renderizamos la lista de productos */}
                <ProductList products={products} />
            </div>
        </div>
    );
};

export default ProductsPage;

// dispatch > función es enviar acciones para modificar el estado global.
// useSelector es un hook que permite acceder al estado.

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



