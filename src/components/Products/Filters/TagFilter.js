import React, { useState } from 'react';
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

    // Filtramos tags basados en la búsqueda
    const filteredTags = searchTerm
        ? tags.filter(tag => 
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : tags;

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

                {/* Lista de tags */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredTags.map(tag => (
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
        </FilterSection>
    );
};

export default TagFilter;