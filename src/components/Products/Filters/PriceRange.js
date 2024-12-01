import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';
import * as Slider from '@radix-ui/react-slider';

const PriceRange = () => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    const products = useSelector(state => state.products.allProducts);
    
    // Calcular el rango global de precios
    const { globalMin, globalMax } = useMemo(() => {
        const allPrices = products.flatMap(product =>
            product.ProductVariants
                .filter(v => v.status === 'active' && v.stock > 0)
                .map(v => Number(v.discountPrice || v.price))
        );

        return {
            globalMin: Math.floor(Math.min(...allPrices, 0)),
            globalMax: Math.ceil(Math.max(...allPrices, 999999))
        };
    }, [products]);

    // Estados locales
    const [minPrice, setMinPrice] = useState(activeFilters.priceRange?.min || globalMin);
    const [maxPrice, setMaxPrice] = useState(activeFilters.priceRange?.max || globalMax);
    const [error, setError] = useState('');

    // Actualizar estados cuando cambian los filtros activos
    useEffect(() => {
        setMinPrice(activeFilters.priceRange?.min || globalMin);
        setMaxPrice(activeFilters.priceRange?.max || globalMax);
    }, [activeFilters.priceRange, globalMin, globalMax]);

    const handlePriceInputChange = (type, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const numberValue = Number(numericValue) || 0;
        
        if (type === 'min') {
            if (numberValue <= maxPrice) {
                setMinPrice(numberValue);
                setError('');
            } else {
                setError('El precio mínimo no puede ser mayor al máximo');
            }
        } else {
            if (numberValue >= minPrice) {
                setMaxPrice(numberValue);
                setError('');
            } else {
                setError('El precio máximo no puede ser menor al mínimo');
            }
        }
    };

    const handleSliderChange = (values) => {
        setMinPrice(values[0]);
        setMaxPrice(values[1]);
        setError('');
    };

    const handleApplyPriceRange = () => {
        if (minPrice > maxPrice) {
            setError('El rango de precios no es válido');
            return;
        }

        dispatch(setActiveFilters({
            ...activeFilters,
            priceRange: { min: minPrice, max: maxPrice }
        }));
    };

    return (
        <FilterSection title="Rango de Precio">
            <div className="space-y-6">
                {/* Slider */}
                <div className="px-2 py-4">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={[Number(minPrice), Number(maxPrice)]}
                        min={globalMin}
                        max={globalMax}
                        step={1}
                        minStepsBetweenThumbs={1}
                        onValueChange={handleSliderChange}
                        onValueCommit={handleApplyPriceRange}
                    >
                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                            <Slider.Range className="absolute bg-black rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-5 h-5 bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            aria-label="Precio mínimo"
                        />
                        <Slider.Thumb
                            className="block w-5 h-5 bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            aria-label="Precio máximo"
                        />
                    </Slider.Root>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mínimo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="text"
                                value={minPrice}
                                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                className="pl-6 w-full py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={globalMin.toString()}
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
                                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                className="pl-6 w-full py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={globalMax.toString()}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                    onClick={handleApplyPriceRange}
                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    Aplicar Rango
                </button>
            </div>
        </FilterSection>
    );
};

export default PriceRange;