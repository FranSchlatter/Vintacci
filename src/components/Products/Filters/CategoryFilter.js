import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const CategoryFilter = ({ categories, activeCategories }) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(state => state.filters.activeFilters);
  // Estado para controlar qué categorías principales están expandidas
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleCategoryChange = (categoryId) => {
    const newCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter(id => id !== categoryId)
      : [...activeCategories, categoryId];

    dispatch(setActiveFilters({
      ...activeFilters,
      category: newCategories
    }));
  };

  const toggleExpanded = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Renderizar categorías con un enfoque más limpio
  const renderCategories = (categories) => {
    return categories.map(category => (
      <div key={category.id} className="mb-1">
        <div className="flex items-center justify-between py-1">
          <div className="flex-1 flex items-center">
            {category.parent_id && (
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={activeCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            <label
              htmlFor={`category-${category.id}`}
              className={`ml-2 text-sm ${category.parent_id ? 'text-gray-600 hover:text-gray-900' : 'font-medium text-gray-800'}`}
            >
              {category.name}
              {!category.parent_id && <span className="text-xs text-gray-400 ml-1">(Principal)</span>}
            </label>
          </div>
          
          {category.subcategories?.length > 0 && (
            <button 
              onClick={() => toggleExpanded(category.id)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight 
                className={`h-4 w-4 text-gray-400 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} 
              />
            </button>
          )}
        </div>

        {/* Subcategorías */}
        {category.subcategories?.length > 0 && expandedCategories[category.id] && (
          <div className="ml-4 mt-1 pl-2 border-l border-gray-200">
            {renderCategories(category.subcategories)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <FilterSection title="Categorías">
      <div className="space-y-1">
        {renderCategories(categories)}
      </div>
    </FilterSection>
  );
};

export default CategoryFilter;