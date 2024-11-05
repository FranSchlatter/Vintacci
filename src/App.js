// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage'; 
import ProductDetailPage from './pages/ProductDetailPage';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const App = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <ToastContainer />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<UserProfilePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />   
                        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
            </div>
        </Router>
    );
};

export default App;