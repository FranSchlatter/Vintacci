import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const CategoryFilter = ({ categories, activeCategories }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(state => state.filters.activeFilters);

  const handleCategoryChange = (categoryId) => {
    const newCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter(id => id !== categoryId)
      : [...activeCategories, categoryId];

    dispatch(setActiveFilters({
      ...activeFilters,
      category: newCategories
    }));
  };

  // Función recursiva para renderizar categorías y sus subcategorías
  const renderCategories = (categories, level = 0) => {
    return categories.map(category => (
      <div key={category.id}>
        <div 
          className={`flex items-center pl-${level * 4}`}
        >
          <input
            type="checkbox"
            id={`category-${category.id}`}
            checked={activeCategories.includes(category.id)}
            onChange={() => handleCategoryChange(category.id)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`category-${category.id}`}
            className="ml-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {category.name}
          </label>
        </div>
        
        {/* Renderizar subcategorías si existen */}
        {category.subcategories?.length > 0 && (
          <div className="ml-4 mt-1">
            {renderCategories(category.subcategories, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <FilterSection title="Categorías">
      {renderCategories(categories)}
    </FilterSection>
  );
};

export default CategoryFilter;