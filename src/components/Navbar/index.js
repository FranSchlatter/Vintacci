// src/components/Navbar/index.js
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import MainMenu from './MainMenu';
import ActionIcons from './ActionIcons';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-black shadow-md w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Logo />
        <div className="hidden md:flex items-center space-x-8">
          <MainMenu />
        </div>
        <div className="flex items-center space-x-4">
          <ActionIcons />
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white p-4 flex flex-col space-y-2">
          <MainMenu />
        </div>
      )}
    </nav>
  );
};

export default Navbar;