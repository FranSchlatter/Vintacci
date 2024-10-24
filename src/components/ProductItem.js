import React from 'react';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        navigate(`/products/${product.id}`); // Redirigir al detalle del producto
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product)); // Agregar el producto al carrito
    };

    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-gray-50 relative">
            <div className="relative">
                {/* Contenedor para la imagen con un tamaño fijo */}
                <div className="h-60 w-full overflow-hidden"> {/* Ajusta la altura aquí */}
                    <img 
                        className="w-full h-full object-contain transition-transform duration-300 transform hover:scale-105" 
                        src={product.image_url} 
                        alt={product.name} 
                        onClick={handleClick} 
                    />
                </div>
    
                {/* Ícono de favorito movido a la parte superior derecha */}
                <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                    <HeartIcon className="h-6 w-6" />
                </button>
            </div>
    
            <div className="px-6 py-4">
                {/* Nombre del producto */}
                <h2 className="font-bold text-xl mb-2">{product.name}</h2>
    
                {/* Descripción del producto */}
                <p className="text-gray-700 text-sm mb-4">{product.description}</p>
    
                <div className="flex justify-between items-center">
                    {/* Precio */}
                    <p className="text-lg font-semibold">${product.price}</p>
    
                    {/* Botón para agregar al carrito */}
                    <button
                        onClick={handleAddToCart} // Agregar manejador de clic
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;

// Recibe product de su componente padre. ProductList linea 9.