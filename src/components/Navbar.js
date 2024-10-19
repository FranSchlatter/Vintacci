// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <h2 className="text-2xl font-bold">Tienda Vintage</h2>
            <ul className="flex space-x-4">
                <li><Link to="/" className="hover:text-gray-400">Inicio</Link></li>
                <li><Link to="/products" className="hover:text-gray-400">Productos</Link></li>
                <li><Link to="/admin" className="hover:text-gray-400">Admin</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;


// Link: Su propósito es permitir la navegación entre diferentes rutas de la aplicación sin recargar la página completa. Cambiar la URL de la barra de direcciones y renderizar el componente correspondiente a la nueva ruta.
// to: Esta propiedad especifica la ruta a la que el enlace llevará al usuario. Por ejemplo, to="/" redirige a la página principal, mientras que to="/products" redirige a la página de productos.