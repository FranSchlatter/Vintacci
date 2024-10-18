// src/components/ProductItem.js
import React from 'react';

const ProductItem = ({ product }) => {
    return (
        <div className="product-item">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.image_url} alt={product.name} width="100" />
            {/* Aquí podrías agregar más detalles como imagen, botón de compra, etc. */}
        </div>
    );
};

export default ProductItem;

// Recibe product de su componente padre. ProductList linea 9.