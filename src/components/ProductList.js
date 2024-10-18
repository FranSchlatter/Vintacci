// src/components/ProductList.js
import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products }) => {
    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;

// Recive product de ProductPage

// Renderizado de Productos: Dentro del return, utilizamos map() para iterar sobre el arreglo de products. Por cada producto, se crea un componente ProductItem, donde:
// key={product.id}: Proporciona una clave única para cada elemento de la lista, lo que ayuda a React a identificar qué elementos han cambiado, agregado o eliminado.
// product={product}: Se pasa el objeto del producto actual al componente ProductItem para que pueda mostrar su información.