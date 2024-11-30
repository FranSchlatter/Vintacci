// src/components/Admin/FilterPanel.js
import React from 'react';
import FormSelect from '../common/FormSelect';
import { X } from 'lucide-react';

const FilterPanel = ({ 
    categories, 
    productOptions, 
    tags, 
    activeFilters, 
    onFilterChange,
    onRemoveFilter
}) => {
    // Agrupar opciones por tipo
    const optionsByType = productOptions.reduce((acc, opt) => {
        if (!acc[opt.type]) {
            acc[opt.type] = [];
        }
        acc[opt.type].push(opt);
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
            {/* Categoría */}
            <div className="flex justify-between items-center">
                <FormSelect
                    label="Categoría"
                    name="category"
                    value={activeFilters.category}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    options={categories.map(cat => ({
                        value: cat.id,
                        label: cat.name
                    }))}
                />
                {activeFilters.category && (
                    <button 
                        onClick={() => onRemoveFilter('category')}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filtros de Estado */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                </label>
                <div className="space-y-2">
                    {['active', 'inactive', 'draft'].map(status => (
                        <label key={status} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={activeFilters.status === status}
                                onChange={(e) => onFilterChange('status', status, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 capitalize">
                                {status}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtros de Opciones (Color, Talle, etc.) */}
            {Object.entries(optionsByType).map(([type, options]) => (
                <div key={type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {type}
                    </label>
                    <div className="space-y-2">
                        {options.map(option => (
                            <label key={option.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.options[type]?.includes(option.id)}
                                    onChange={(e) => onFilterChange(`options.${type}`, option.id, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    {option.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {/* Filtro de Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                </label>
                <div className="space-y-2">
                    {tags.map(tag => (
                        <label key={tag.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={activeFilters.tags.includes(tag.id)}
                                onChange={(e) => onFilterChange('tags', tag.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                {tag.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro de Precio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                </label>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Precio mínimo"
                        value={activeFilters.price.min}
                        onChange={(e) => onFilterChange('price', {
                            ...activeFilters.price,
                            min: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Precio máximo"
                        value={activeFilters.price.max}
                        onChange={(e) => onFilterChange('price', {
                            ...activeFilters.price,
                            max: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;