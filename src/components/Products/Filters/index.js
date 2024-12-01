// Filters/index.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFilters } from '../../../redux/actions/filterActions';
import PriceRange from './PriceRange';
import CategoryFilter from './CategoryFilter';
import TagFilter from './TagFilter';
import ActiveFilters from './ActiveFilters';

// Componente principal de filtros que orquesta todos los tipos de filtros
const Filters = () => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(state => state.filters.activeFilters);
  const categories = useSelector(state => state.categories.categories);
  const tags = useSelector(state => state.tags.tags);

  // Limpia todos los filtros activos
  const handleClearAll = () => {
    dispatch(setActiveFilters({
      category: [],
      brand: [],
      priceRange: { min: 0, max: 999999 }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Cabecera de filtros */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpiar todo
        </button>
      </div>

      {/* Filtros activos */}
      <ActiveFilters />

      {/* Secciones de filtros */}
      <div className="space-y-6">
        <PriceRange />
        
        <CategoryFilter 
          categories={categories}
          activeCategories={activeFilters.category || []}
        />

        <TagFilter 
          tags={tags}
          activeTags={activeFilters.tags || []}
        />
      </div>
    </div>
  );
};

export default Filters;