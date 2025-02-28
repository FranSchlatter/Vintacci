import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const ORDERED_TYPES = ["edicion", "version", "equipo", "temporada", "caracteristica", "color"];

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

    const filteredTags = useMemo(() => {
        return tags.filter(tag => 
            tag.type !== "nothing" &&
            (!searchTerm || tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [tags, searchTerm]);

    const groupedTags = useMemo(() => {
        let groups = {};
        
        filteredTags.forEach(tag => {
            if (!groups[tag.type]) groups[tag.type] = [];
            groups[tag.type].push(tag);
        });

        Object.keys(groups).forEach(type => {
            groups[type].sort((a, b) => {
                if (type === "temporada") {
                    return parseInt(b.name.substring(0, 4)) - parseInt(a.name.substring(0, 4));
                }
                return b.AssociatedToProd.length - a.AssociatedToProd.length;
            });
        });

        return ORDERED_TYPES.map(type => [type, groups[type] || []]).filter(([_, list]) => list.length > 0);
    }, [filteredTags]);

    return (
        <div>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar tags..."
                    className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <div className="space-y-4">
                {groupedTags.map(([type, typeTags]) => (
                    <FilterSection key={type} title={type.charAt(0).toUpperCase() + type.slice(1)} defaultExpanded={false}>
                        <div className="pl-2 space-y-1">
                            {typeTags.map(tag => (
                                <label key={tag.id} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
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
                    </FilterSection>
                ))}
            </div>
        </div>
    );
};

export default TagFilter;
