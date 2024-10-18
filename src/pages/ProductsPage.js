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
