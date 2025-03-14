import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const ActiveFilters = () => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    const categories = useSelector(state => state.categories.categories);
    const tags = useSelector(state => state.tags.tags);

    // Función auxiliar para buscar nombres de categorías por ID
    const findCategoryName = (categoryId) => {
        const findInCategories = (categories) => {
            for (const category of categories) {
                if (category.id === categoryId) return category.name;
                if (category.subcategories) {
                    const found = findInCategories(category.subcategories);
                    if (found) return found;
                }
            }
            return null;
        };
        return findInCategories(categories);
    };

    const removeFilter = (type, value) => {
        const newFilters = { ...activeFilters };
    
        if (type === 'priceRange') {
            newFilters.priceRange = { min: 0, max: 999999 };
        } else if (type === 'tags') {
            // Ahora value es un objeto { type, id }
            newFilters.tags = newFilters.tags.filter(tag => tag.id !== value.id || tag.type !== value.type);
        } else if (Array.isArray(newFilters[type])) {
            newFilters[type] = newFilters[type].filter(item => item !== value);
        }
    
        dispatch(setActiveFilters(newFilters));
    };

    const hasActiveFilters = () => {
        return (
            (activeFilters.category?.length > 0) ||
            (activeFilters.tags?.length > 0) ||
            (activeFilters.priceRange?.min > 0 || activeFilters.priceRange?.max < 999999) ||
            (activeFilters.search && activeFilters.search.trim() !== '')
        );
    };

    if (!hasActiveFilters()) return null;

    return (
        <div className="p-3 bg-blue-50 rounded-md space-y-2">
            <h3 className="text-sm font-medium text-blue-800">Filtros activos:</h3>
            <div className="flex flex-wrap gap-2">
                {/* Búsqueda */}
                {activeFilters.search && activeFilters.search.trim() !== '' && (
                    <button
                        onClick={() => {
                            const newFilters = { ...activeFilters, search: '' };
                            dispatch(setActiveFilters(newFilters));
                        }}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                        Búsqueda: {activeFilters.search}
                        <X className="ml-1 h-4 w-4" />
                    </button>
                )}
                
                {/* Filtros de categoría */}
                {activeFilters.category?.map(categoryId => {
                    const name = findCategoryName(categoryId);
                    if (!name) return null;
                    return (
                        <button
                            key={categoryId}
                            onClick={() => removeFilter('category', categoryId)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                            {name}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    );
                })}

                {/* Filtros de tags */}
                {activeFilters.tags?.map(tagObj => {
                    const tag = tags.find(t => t.id === tagObj.id); // Buscar por id del objeto completo
                    if (!tag) return null;
                    return (
                        <button
                            key={tagObj.id}
                            onClick={() => removeFilter('tags', tagObj)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                            {tag.name}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveFilters;