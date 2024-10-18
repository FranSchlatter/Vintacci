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
