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
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;


// const App = () => { ... }: Define el componente funcional App, que es el componente raíz de la aplicación.
// <Router>: Contenedor que permite la navegación entre diferentes componentes basados en la URL actual.
// <Navbar />: Renderiza el componente Navbar dentro del Router, lo que significa que la barra de navegación estará visible en todas las rutas.
// <Routes>: Contenedor que agrupa las diferentes rutas definidas en la aplicación.
// <Route path="/" element={<HomePage />} />: Define la ruta raíz (/) que renderiza el componente HomePage cuando la URL es /.
// <Route path="/products" element={<ProductsPage />} />: Define la ruta /products que renderiza el componente ProductsPage cuando la URL es /products.