import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveFilters } from '../../../redux/actions/filterActions';
import { ChevronLeft, Filter } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import TagFilter from './TagFilter';
import ActiveFilters from './ActiveFilters';
import SearchBar from './SearchBar';

const Filters = () => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(state => state.filters.activeFilters);
  const categories = useSelector(state => state.categories.categories);
  const tags = useSelector(state => state.tags.tags);
  
  // Estado para mostrar/ocultar los filtros en móvil
  const [showFilters, setShowFilters] = useState(false);
  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Si no es móvil, siempre mostrar los filtros
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleClearAll = () => {
    dispatch(setActiveFilters({
      category: [],
      tags: [],
      priceRange: { min: 0, max: 999999 },
      variantOptions: {},
      search: ''
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      {/* Botón de filtros móvil (visible solo en móvil) */}
      {isMobile && (
        <button 
          onClick={toggleFilters}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
          aria-label="Toggle filters"
        >
          <Filter className="h-6 w-6" />
        </button>
      )}

      {/* Contenedor principal de filtros con posición condicional */}
      <div 
        className={`
          ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          md:transition-none
          bg-white rounded-lg shadow
          fixed md:sticky md:top-4 md:h-[calc(100vh-2rem)] 
          top-0 left-0 z-20 w-full md:w-auto 
          h-full md:overflow-auto
          ${isMobile ? 'p-4 pb-20' : 'p-4'}
        `}
      >
        {/* Cabecera de filtros */}
        <div className="flex justify-between items-center border-b pb-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar todo
            </button>
            {isMobile && (
              <button 
                onClick={toggleFilters} 
                className="md:hidden text-gray-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido de filtros con scroll */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto pb-8 pr-1">
          {/* SearchBar */}
          <div className="my-4">
            <SearchBar />
          </div>

          {/* Filtros activos */}
          <div className="mb-4">
            <ActiveFilters />
          </div>

          {/* Secciones de filtros */}
          <div className="space-y-4">
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
      </div>

      {/* Overlay para cerrar los filtros en móvil */}
      {showFilters && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={toggleFilters}
        />
      )}
    </>
  );
};

export default Filters;