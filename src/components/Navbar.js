// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <h2>Tienda Vintage</h2>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/products">Productos</Link></li>
                <li><Link to="/users">Usuarios</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

// Link: Su propósito es permitir la navegación entre diferentes rutas de la aplicación sin recargar la página completa. Cambiar la URL de la barra de direcciones y renderizar el componente correspondiente a la nueva ruta.
// to: Esta propiedad especifica la ruta a la que el enlace llevará al usuario. Por ejemplo, to="/" redirige a la página principal, mientras que to="/products" redirige a la página de productos.