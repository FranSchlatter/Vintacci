// src/components/Navbar/ActionIcons/UserMenuDropdown.js
import React from 'react';
import { Link } from 'react-router-dom';

const UserMenuDropdown = ({ isAuthenticated, currentUser, onLogout, onClose }) => {
  return (
    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
      {isAuthenticated ? (
        <>
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{currentUser?.first_name}</p>
            <p className="text-xs text-gray-500">{currentUser?.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Mi Perfil
          </Link>
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Panel Admin
            </Link>
          )}
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Registrarse
          </Link>
        </>
      )}
    </div>
  );
};

export default UserMenuDropdown;