import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/outline';
import { setActiveFilters } from '../redux/actions/filterActions';
import { filterConfig } from '../config/filterConfig';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  
  // Obtener el estado del carrito
  const cartItems = useSelector(state => state.cart?.items || []);
  // Calcular el total de items
  const cartItemCount = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);

  const productMenuItems = {
    'Categorías': filterConfig.category.options,
    'Género': filterConfig.sex.options,
    'Estilo': filterConfig.style.options,
    'Era': filterConfig.era.options
  };

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
              onMouseLeave={() => setIsProductMenuOpen(false)} // Agregamos este handler
            >
              <button onClick={() => handleProductClick('Ver Todo', '')}
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
          </div>

          {/* Iconos derecha */}
          <div className="flex items-center space-x-6">
            {/* Carrito con contador */}
            <button onClick={() => navigate('/cart')} className="relative text-gray-700 hover:text-gray-900" >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                    </span>
                )}
            </button>
            {/* Admin Panel */}
            <button onClick={() => navigate('/admin')} className="text-gray-700 hover:text-gray-900">
              <UserIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;