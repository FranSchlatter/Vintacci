// src/pages/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="sm:flex sm:items-center">
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full sm:w-1/2 object-cover h-64 sm:h-auto"
                    />
                    <div className="p-6 sm:p-10">
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <p className="text-xl font-semibold text-green-500 mb-6">${product.price}</p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
