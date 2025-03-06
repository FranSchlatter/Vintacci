// src/components/Navbar/MainMenu/index.js
import React from 'react';
import MenuLink from './MenuLink';
import ProductsMenu from './ProductsMenu';

const MainMenu = () => {
  return (
    <div className="flex items-center space-x-8">
      <MenuLink to="/" label="Inicio" />
      <ProductsMenu />
      <MenuLink to="/about" label="Nosotros" />
      <MenuLink to="/contact" label="Contacto" />
    </div>
  );
};

export default MainMenu;