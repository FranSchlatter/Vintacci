import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/outline';
import { setActiveFilters } from '../redux/actions/filterActions';
import { filterConfig } from '../config/filterConfig';
import { logoutUser } from '../redux/actions/authActions'

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  // Obtener el estado del carrito
  const cartItems = useSelector(state => state.cart?.items || []);
  // Calcular el total de items
  const cartItemCount = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, currentUser } = useSelector(state => state.auth);

  const productMenuItems = {
    'Categorías': filterConfig.category.options,
    'Género': filterConfig.sex.options,
    'Estilo': filterConfig.style.options,
    'Era': filterConfig.era.options
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = async (category, item) => {
    const emptyFilters = {
      category: [],
      brand: [],
      style: [],
      era: [],
      size: [],
      sex: [],
      color: [],
      material: [],
      priceRange: { min: 0, max: 999999 }
    };

    if (category === 'Ver Todo') {
      dispatch(setActiveFilters(emptyFilters));
    } else {
      const filterMap = {
        'Categorías': 'category',
        'Género': 'sex',
        'Estilo': 'style',
        'Era': 'era'
      };

      const filterType = filterMap[category];
      
      if (filterType) {
        const newFilters = {
          ...emptyFilters,
          [filterType]: [item]
        };
        await dispatch(setActiveFilters(newFilters));
      }
    }

    navigate('/products');
    setIsProductMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const userMenu = (
    <div 
      ref={userMenuRef}
      className={`absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50 ${
        isUserMenuOpen ? 'block' : 'hidden'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {isAuthenticated ? (
        <>
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{currentUser?.first_name}</p>
            <p className="text-xs text-gray-500">{currentUser?.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Mi Perfil
          </Link>
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsUserMenuOpen(false)}
            >
              Panel Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
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
            onClick={() => setIsUserMenuOpen(false)}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsUserMenuOpen(false)}
          >
            Registrarse
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Vintacci */}
          <Link to="/" className="text-2xl font-bold text-vintage-accent">
            Vintacci
          </Link>

          {/* Menú central */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Inicio
            </Link>

            {/* Menú Productos */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsProductMenuOpen(true)}
              onMouseLeave={() => setIsProductMenuOpen(false)}
            >
              <button 
                onClick={() => handleProductClick('Ver Todo', '')}
                className="text-gray-700 hover:text-gray-900"
              >
                Productos
              </button>

              {isProductMenuOpen && (
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-[600px] bg-white shadow-xl rounded-b-lg z-50"
                >
                  <div className="grid grid-cols-4 gap-4 p-6">
                    {Object.entries(productMenuItems).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <button
                          onClick={() => handleProductClick(category, '')}
                          className="font-medium text-gray-900 hover:text-vintage-accent"
                        >
                          {category}
                        </button>
                        
                        <div className="flex flex-col space-y-1">
                          {items.map(item => (
                            <button
                              key={item}
                              onClick={() => handleProductClick(category, item)}
                              className="text-sm text-gray-600 hover:text-vintage-accent text-left pl-2"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 text-center rounded-b-lg">
                    <button
                      onClick={() => handleProductClick('Ver Todo', '')}
                      className="text-vintage-accent hover:text-vintage-accent-dark font-medium"
                    >
                      Ver todos los productos
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              Sobre Nosotros
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-gray-900">
              Contacto
            </Link>

            {/* TODO: REMOVER LUEGO */}
            <Link to="/admin" className="text-gray-700 hover:text-gray-900">
              Admin
            </Link>
          </div>

          {/* Iconos derecha */}
          <div className="flex items-center space-x-6">
            {/* Carrito con contador */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-700 hover:text-gray-900"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <UserIcon className="h-6 w-6" />
              </button>
              {userMenu}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;