// src/components/Navbar/index.js
import React from 'react';
import Logo from './Logo';
import MainMenu from './MainMenu';
import ActionIcons from './ActionIcons';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <MainMenu />
          <ActionIcons />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;