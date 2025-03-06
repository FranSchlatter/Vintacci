// src/components/Navbar/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="font-bold text-vintage-accent">
    Archivo Deportivo
  </Link>
);

export default Logo;