// src/components/Filters/ActiveFilters.js
import React from 'react';

const ActiveFilters = ({ activeFilters, totalProducts, onRemoveFilter }) => {
    const filterLabels = {
        category: 'Categoría',
        brand: 'Marca',
        style: 'Estilo',
        era: 'Época',
        size: 'Talla',
        sex: 'Género',
        color: 'Color',
        material: 'Material'
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([filterType, values]) => {
                        if (filterType === 'priceRange') {
                            if (values.min > 0 || values.max < 999999) {
                                return (
                                    <span
                                        key="price"
                                        className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                    >
                                        Precio: ${values.min} - ${values.max}
                                        <button
                                            onClick={() => onRemoveFilter('priceRange')}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            }
                            return null;
                        }

                        return values.map(value => (
                            <span
                                key={`${filterType}-${value}`}
                                className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                            >
                                {filterLabels[filterType]}: {value}
                                <button
                                    onClick={() => onRemoveFilter(filterType, value)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ));
                    })}
                </div>
                <span className="text-gray-600">
                    {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
                </span>
            </div>
        </div>
    );
};

export default ActiveFilters;