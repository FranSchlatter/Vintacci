// src/components/Navbar/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="text-2xl font-bold text-vintage-accent">
    Vintacci
  </Link>
);

export default Logo;