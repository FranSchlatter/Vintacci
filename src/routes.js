// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/users" element={<UsersPage />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
