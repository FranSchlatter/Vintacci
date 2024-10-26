
// src/components/Filters/PriceRangeFilter.js
import React, { useState, useEffect } from 'react';

const PriceRangeFilter = ({ activeRange, onChange, products }) => {
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    
    const [localRange, setLocalRange] = useState(activeRange);

    useEffect(() => {
        setLocalRange(activeRange);
    }, [activeRange]);

    const handleChange = (type, value) => {
        const newRange = { ...localRange, [type]: value };
        setLocalRange(newRange);
    };

    const handleBlur = () => {
        onChange(localRange.min, localRange.max);
    };

    return (
        <div className="border-b pb-4">
            <h3 className="font-medium mb-3">Precio</h3>
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={localRange.min}
                        onChange={(e) => handleChange('min', e.target.value)}
                        onBlur={handleBlur}
                        placeholder={`Min (${minPrice})`}
                        className="w-full p-2 border rounded"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={localRange.max}
                        onChange={(e) => handleChange('max', e.target.value)}
                        onBlur={handleBlur}
                        placeholder={`Max (${maxPrice})`}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceRangeFilter;