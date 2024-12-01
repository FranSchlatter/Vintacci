import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/index';
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
import ProtectedRoute from './components/ProtectedRoute'; // Deberíamos agregar esto

const App = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-gray-50">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route 
                            path="/products" 
                            element={<ProductsPage />} 
                        />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/cart" element={<Cart />} />
                        
                        {/* Rutas protegidas */}
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute>
                                    <UserProfilePage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/checkout" 
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/orders/:orderId" 
                            element={
                                <ProtectedRoute>
                                    <OrderDetailPage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Rutas públicas */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route 
                            path="/order-confirmation/:orderNumber" 
                            element={<OrderConfirmationPage />} 
                        />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer 
                    position="bottom-right" 
                    autoClose={2000} 
                    hideProgressBar={false} 
                    newestOnTop={false} 
                    closeOnClick 
                    rtl={false} 
                    pauseOnFocusLoss 
                    draggable 
                    pauseOnHover 
                    theme="dark"
                />
            </div>
        </Router>
    );
};

export default App;