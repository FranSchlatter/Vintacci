// src/components/Footer/index.js
import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">© 2024 Archivo deportivo. Todos los derechos reservados.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://www.instagram.com/archivo_deportivo/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Instagram size={20} />
          </a>
          <a href="contacto@ArchivoDeportivo.com" className="hover:text-gray-400">
            <Mail size={20} />
          </a>
          <a href="https://wa.me/54934243665585" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Phone size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;