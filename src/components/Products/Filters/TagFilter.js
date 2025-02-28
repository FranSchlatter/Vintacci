import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const TagFilter = ({ tags, activeTags }) => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTagChange = (tagId) => {
        const newTags = activeTags.includes(tagId)
            ? activeTags.filter(id => id !== tagId)
            : [...activeTags, tagId];

        dispatch(setActiveFilters({
            ...activeFilters,
            tags: newTags
        }));
    };

    // Agrupamos los tags por tipo y los ordenamos alfabéticamente
    const groupedTags = useMemo(() => {
        // Primero filtramos los tags según el término de búsqueda
        const filteredTags = searchTerm
            ? tags.filter(tag => 
                tag.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : tags;
        
        // Agrupamos por tipo
        const groups = {};
        filteredTags.forEach(tag => {
            const type = tag.type || 'otros'; // Si no tiene tipo, lo ponemos en 'otros'
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(tag);
        });
        
        // Ordenamos las etiquetas dentro de cada grupo alfabéticamente
        Object.keys(groups).forEach(type => {
            groups[type].sort((a, b) => {
                // Si los nombres son números dentro de strings, los convertimos para ordenarlos numéricamente
                const aIsNumber = !isNaN(a.name);
                const bIsNumber = !isNaN(b.name);
                
                if (aIsNumber && bIsNumber) {
                    return Number(a.name) - Number(b.name);
                }
                
                return a.name.localeCompare(b.name);
            });
        });
        
        // Obtenemos un array de grupos ordenados alfabéticamente por tipo
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [tags, searchTerm]);

    return (
        <FilterSection title="Tags">
            <div className="space-y-4">
                {/* Buscador de tags */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar tags..."
                        className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Lista de tags agrupados por tipo */}
                <div className="max-h-60 overflow-y-auto space-y-4">
                    {groupedTags.map(([type, typeTags]) => (
                        <div key={type} className="space-y-2">
                            {/* Título del tipo de tag */}
                            <h4 className="text-sm font-medium text-gray-700 capitalize">
                                {type}
                            </h4>
                            
                            {/* Tags de este tipo */}
                            <div className="pl-2 space-y-1">
                                {typeTags.map(tag => (
                                    <label
                                        key={tag.id}
                                        className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={activeTags.includes(tag.id)}
                                            onChange={() => handleTagChange(tag.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            {tag.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {/* Mensaje si no hay resultados */}
                    {groupedTags.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                            No se encontraron tags que coincidan con la búsqueda
                        </p>
                    )}
                </div>
            </div>
        </FilterSection>
    );
};

export default TagFilter;