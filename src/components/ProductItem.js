// src/components/ProductItem.js
import React from 'react';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/outline';

const ProductItem = ({ product }) => {
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white relative">
            <div className="relative">
                {/* Imagen del producto ajustada para no quedar recortada */}
                <img className="w-full h-48 object-contain" src={product.image_url} alt={product.name} />

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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
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