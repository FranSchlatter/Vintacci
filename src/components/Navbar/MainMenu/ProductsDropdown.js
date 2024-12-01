// src/components/Navbar/MainMenu/ProductsDropdown.js
import React from 'react';

const ProductsDropdown = ({ onItemClick }) => {
  const productMenuItems = {
    'Categorías': ['Remeras', 'Pantalones', 'Zapatillas', 'Accesorios'],
    'Género': ['Hombre', 'Mujer', 'Unisex'],
    'Estilo': ['Casual', 'Deportivo', 'Formal', 'Vintage'],
    'Era': ['80s', '90s', '2000s']
  };

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[600px] bg-white shadow-xl rounded-b-lg z-50">
      <div className="grid grid-cols-4 gap-4 p-6">
        {Object.entries(productMenuItems).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => onItemClick(category, '')}
              className="font-medium text-gray-900 hover:text-vintage-accent"
            >
              {category}
            </button>
            
            <div className="flex flex-col space-y-1">
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => onItemClick(category, item)}
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
          onClick={() => onItemClick('Ver Todo', '')}
          className="text-vintage-accent hover:text-vintage-accent-dark font-medium"
        >
          Ver todos los productos
        </button>
      </div>
    </div>
  );
};

export default ProductsDropdown;