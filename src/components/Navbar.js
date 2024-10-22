// src/components/Navbar.js
// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h2 className="text-3xl font-bold">Vintacci</h2>
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-gray-400 transition duration-300">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/products" className="hover:text-gray-400 transition duration-300">Productos</Link>
                        
                    </li>
                    <li>
                        <Link to="/cart" className="hover:text-gray-400 transition duration-300">Cart</Link>
                    </li>
                    <li>
                        <Link to="/admin" className="hover:text-gray-400 transition duration-300">Admin</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;



// Link: Su propósito es permitir la navegación entre diferentes rutas de la aplicación sin recargar la página completa. Cambiar la URL de la barra de direcciones y renderizar el componente correspondiente a la nueva ruta.
// to: Esta propiedad especifica la ruta a la que el enlace llevará al usuario. Por ejemplo, to="/" redirige a la página principal, mientras que to="/products" redirige a la página de productos.