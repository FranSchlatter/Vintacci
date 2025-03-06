import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductList from '../components/Products/ProductList';
import { fetchCategories } from '../redux/actions/categoryActions';
import { fetchTags } from '../redux/actions/tagActions';
import { fetchProducts } from '../redux/actions/productActions';
import { fetchOptions } from '../redux/actions/productOptionActions';

const ProductsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Cargamos todos los datos necesarios en paralelo
                await Promise.all([
                    dispatch(fetchProducts()),
                    dispatch(fetchCategories()),
                    dispatch(fetchTags()),
                    dispatch(fetchOptions())
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        loadInitialData();
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Archivo Deportivo
                </h1>
                <ProductList />
            </div>
        </div>
    );
};

export default ProductsPage;