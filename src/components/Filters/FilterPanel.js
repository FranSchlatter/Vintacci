import React from 'react';
import FilterSection from './FilterSection';
import PriceRangeFilter from './PriceRangeFilter';
import { filterConfig } from '../../config/filterConfig';

const FilterPanel = ({ products, activeFilters, onFilterChange, onPriceRangeChange }) => {
    // Función para calcular las opciones disponibles considerando los filtros actuales
    const getAvailableOptions = (field) => {
        // Crear una copia de los filtros activos excluyendo el campo actual
        const otherFilters = Object.fromEntries(
            Object.entries(activeFilters).filter(([key]) => key !== field)
        );

        // Filtrar productos que cumplen con los otros filtros activos
        const filteredProducts = products.filter(product => {
            return Object.entries(otherFilters).every(([filterType, filterValues]) => {
                if (filterType === 'priceRange') {
                    return product.price >= filterValues.min && product.price <= filterValues.max;
                }
                return filterValues.length === 0 || filterValues.includes(product[filterType]);
            });
        });

        // Contar las ocurrencias de cada opción en los productos filtrados
        const counts = filteredProducts.reduce((acc, product) => {
            const value = product[field];
            if (value) {
                acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
        }, {});

        // Asegurarse de que todas las opciones configuradas estén incluidas
        // aunque tengan cuenta 0
        filterConfig[field].options.forEach(option => {
            if (!(option in counts)) {
                counts[option] = 0;
            }
        });

        return counts;
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            
            <PriceRangeFilter
                activeRange={activeFilters.priceRange}
                onChange={onPriceRangeChange}
                products={products}
            />

            {Object.entries(filterConfig).map(([field, config]) => (
                <FilterSection
                    key={field}
                    title={config.title}
                    field={field}
                    values={getAvailableOptions(field)}
                    activeValues={activeFilters[field]}
                    onChange={onFilterChange}
                />
            ))}
        </div>
    );
};

export default FilterPanel;