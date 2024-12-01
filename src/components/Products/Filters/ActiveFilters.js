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
        } else if (Array.isArray(newFilters[type])) {
            newFilters[type] = newFilters[type].filter(item => item !== value);
        }

        dispatch(setActiveFilters(newFilters));
    };

    const hasActiveFilters = () => {
        return (
            activeFilters.category?.length > 0 ||
            activeFilters.tags?.length > 0 ||
            (activeFilters.priceRange?.min > 0 || 
             activeFilters.priceRange?.max < 999999)
        );
    };

    if (!hasActiveFilters()) return null;

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Filtros activos:</h3>
            <div className="flex flex-wrap gap-2">
                {/* Filtros de categoría */}
                {activeFilters.category?.map(categoryId => {
                    const name = findCategoryName(categoryId);
                    if (!name) return null;
                    return (
                        <button
                            key={categoryId}
                            onClick={() => removeFilter('category', categoryId)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            {name}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    );
                })}

                {/* Filtros de tags */}
                {activeFilters.tags?.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                        <button
                            key={tagId}
                            onClick={() => removeFilter('tags', tagId)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            {tag.name}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    );
                })}

                {/* Filtro de precio */}
                {(activeFilters.priceRange?.min > 0 || 
                  activeFilters.priceRange?.max < 999999) && (
                    <button
                        onClick={() => removeFilter('priceRange')}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        ${activeFilters.priceRange.min} - ${activeFilters.priceRange.max}
                        <X className="ml-1 h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActiveFilters;