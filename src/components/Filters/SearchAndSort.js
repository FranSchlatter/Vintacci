// src/components/Filters/SearchAndSort.js
import React from 'react';

const SearchAndSort = ({ searchQuery, sortBy, onSearchChange, onSortChange }) => {
    return (
        <div className="flex justify-between items-center mb-4 gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {/* Selector de ordenamiento */}
            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="p-2 border rounded-lg bg-white"
            >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
            </select>
        </div>
    );
};

export default SearchAndSort;