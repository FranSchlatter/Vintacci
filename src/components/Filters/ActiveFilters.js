import React from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const ActiveFilters = () => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    const categories = useSelector(state => state.categories.categories);
    const tags = useSelector(state => state.tags.tags);

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

        switch(type) {
            case 'priceRange':
                newFilters.priceRange = { min: 0, max: 999999 };
                break;
            case 'category':
            case 'tags':
                newFilters[type] = newFilters[type].filter(item => item !== value);
                break;
            case 'variantOptions':
                const [optionType, optionId] = value.split('|');
                if (newFilters.variantOptions?.[optionType]) {
                    newFilters.variantOptions[optionType] = 
                        newFilters.variantOptions[optionType].filter(id => id !== optionId);
                    if (newFilters.variantOptions[optionType].length === 0) {
                        delete newFilters.variantOptions[optionType];
                    }
                }
                break;
            default:
                break;
        }

        dispatch(setActiveFilters(newFilters));
    };

    return (
        <div className="space-y-2">
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
                            Categoría: {name}
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
                            Tag: {tag.name}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    );
                })}

                {/* Filtro de precio */}
                {(activeFilters.priceRange?.min > 0 || activeFilters.priceRange?.max < 999999) && (
                    <button
                        onClick={() => removeFilter('priceRange')}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Precio: ${activeFilters.priceRange.min} - ${activeFilters.priceRange.max}
                        <X className="ml-1 h-4 w-4" />
                    </button>
                )}

                {/* Filtros de variantes (color, talla, etc.) */}
                {Object.entries(activeFilters.variantOptions || {}).map(([optionType, optionIds]) => (
                    optionIds.map(optionId => (
                        <button
                            key={`${optionType}-${optionId}`}
                            onClick={() => removeFilter('variantOptions', `${optionType}|${optionId}`)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            {optionType.charAt(0).toUpperCase() + optionType.slice(1)}: {optionId}
                            <X className="ml-1 h-4 w-4" />
                        </button>
                    ))
                ))}
            </div>
        </div>
    );
};

export default ActiveFilters;