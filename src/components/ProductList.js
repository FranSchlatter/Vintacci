// src/components/ProductList/ProductList.js
import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products }) => {
    return (
        <div className="product-list container mx-auto p-6 bg-vintage-bg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products && products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;