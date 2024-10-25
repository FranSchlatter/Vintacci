// src/pages/ProductDetailPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';
import { fetchProductId } from '../redux/actions/productActions';

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.products.idProduct);

    useEffect(() => {
        dispatch(fetchProductId(id));
    }, [id, dispatch]);

    const handleAddToCart = () => {
        dispatch(addToCart(product)); // Agregar el producto al carrito
    };

    if (!product) {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }

    return (
        <div className="vintage-bg min-h-screen py-10">
            <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden font-vintage">
                {/* Contenedor principal para la imagen y los detalles */}
                <div className="sm:flex sm:items-center">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full sm:w-1/2 object-cover h-64 sm:h-auto"
                    />
                    <div className="p-6 sm:p-10">
                        <h1 className="text-4xl font-bold mb-4 text-vintage-accent">{product.name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                        <p className="text-2xl font-semibold text-vintage-accent mb-6">${product.price}</p>
                        {/* Botón de agregar al carrito */}
                        <button
                            onClick={handleAddToCart} // Agregar manejador de clic
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;