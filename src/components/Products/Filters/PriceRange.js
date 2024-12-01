import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const PriceRange = () => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    
    // Estados locales para los inputs
    const [minPrice, setMinPrice] = useState(activeFilters.priceRange?.min || '');
    const [maxPrice, setMaxPrice] = useState(activeFilters.priceRange?.max || '');
    const [error, setError] = useState('');

    // Actualizamos los estados locales cuando cambian los filtros activos
    useEffect(() => {
        setMinPrice(activeFilters.priceRange?.min || '');
        setMaxPrice(activeFilters.priceRange?.max || '');
    }, [activeFilters.priceRange]);

    const handlePriceChange = (type, value) => {
        // Limpiamos cualquier carácter no numérico
        const numericValue = value.replace(/[^0-9]/g, '');
        
        if (type === 'min') {
            setMinPrice(numericValue);
        } else {
            setMaxPrice(numericValue);
        }
        setError('');
    };

    const handleApplyPriceRange = () => {
        const min = Number(minPrice) || 0;
        const max = Number(maxPrice) || 999999;

        // Validaciones
        if (min > max) {
            setError('El precio mínimo no puede ser mayor al máximo');
            return;
        }

        dispatch(setActiveFilters({
            ...activeFilters,
            priceRange: { min, max }
        }));
    };

    return (
        <FilterSection title="Rango de Precio">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mínimo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="text"
                                value={minPrice}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                                className="pl-6 w-full py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Máximo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="text"
                                value={maxPrice}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                className="pl-6 w-full py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                    onClick={handleApplyPriceRange}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Aplicar Rango
                </button>
            </div>
        </FilterSection>
    );
};

export default PriceRange;