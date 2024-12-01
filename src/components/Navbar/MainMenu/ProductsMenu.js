import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';
import { setActiveFilters } from '../../../redux/actions/filterActions';
import { fetchCategories } from '../../../redux/actions/categoryActions';

const ProductsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener categorías y estado de carga
  const { categories, error } = useSelector(state => state.categories);

  // Cargar categorías cuando el componente se monta
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = async (category) => {
    const filters = {
      category: [category.id],
      brand: [],
      priceRange: { min: 0, max: 999999 }
    };

    await dispatch(setActiveFilters(filters));
    navigate('/products');
    setIsOpen(false);
  };

  const CategoryMenuItem = ({ category }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => handleCategoryClick(category)}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between group"
        >
          <span className="text-gray-700 group-hover:text-gray-900">{category.name}</span>
          {hasSubcategories && (
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </button>

        {isHovered && hasSubcategories && (
          <div 
            className="absolute left-full top-0 bg-white shadow-lg rounded-r-lg min-w-[200px] py-1"
            style={{ marginLeft: '1px' }}
          >
            {category.subcategories.map(subcategory => (
              <CategoryMenuItem 
                key={subcategory.id} 
                category={subcategory}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Manejar estados de carga y error
  if (error) {
    console.error('Error loading categories:', error);
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="relative">
        <button className="text-gray-700 hover:text-gray-900 font-medium">
          Productos
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-gray-700 hover:text-gray-900 font-medium">
        Productos
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg min-w-[250px] py-2 z-50">
          <button
            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => {
              dispatch(setActiveFilters({}));
              navigate('/products');
              setIsOpen(false);
            }}
          >
            Ver todas las categorías
          </button>

          <div className="border-t my-1" />

          {categories.map(category => (
            <CategoryMenuItem 
              key={category.id} 
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsMenu;