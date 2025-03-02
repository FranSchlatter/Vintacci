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

    const handleSelectAll = (tags) => {
        const allTagIds = tags.map(tag => tag.id);
        const newTags = [...new Set([...activeTags, ...allTagIds])];

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

    const groupedTeams = useMemo(() => {
        let clubes = {};
        let selecciones = {};
    
        // Orden predefinido para clubes y selecciones
        const CLUB_ORDER = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Primera División", "Chile Primera División", "Liga MX","Otros"];
        const NATIONAL_ORDER = ["Euro", "Copa America", "Otras"];
    
        filteredTags.forEach(tag => {
            if (tag.type === "equipo") {
                const category = tag.AssociatedToCat?.[0]?.name || "Otros";
    
                if (category.includes("Euro") || category.includes("Copa America") || category.includes("Otras")) {
                    if (!selecciones[category]) selecciones[category] = [];
                    selecciones[category].push(tag);
                } else {
                    if (!clubes[category]) clubes[category] = [];
                    clubes[category].push(tag);
                }
            }
        });
    
        // Ordenar tags dentro de cada liga/competición por cantidad de productos
        const sortByProductCount = (a, b) => (b.AssociatedToProd?.length || 0) - (a.AssociatedToProd?.length || 0);
        Object.keys(clubes).forEach(league => clubes[league].sort(sortByProductCount));
        Object.keys(selecciones).forEach(competition => selecciones[competition].sort(sortByProductCount));
    
        // Reordenar los objetos según el orden predefinido
        const sortByDefinedOrder = (orderArray, obj) => {
            let sortedObj = {};
            orderArray.forEach(category => {
                if (obj[category]) sortedObj[category] = obj[category];
            });
            return sortedObj;
        };
    
        return {
            clubes: sortByDefinedOrder(CLUB_ORDER, clubes),
            selecciones: sortByDefinedOrder(NATIONAL_ORDER, selecciones),
        };
    }, [filteredTags]);

    const groupedTags = useMemo(() => {
        let groups = {};
        
        filteredTags.forEach(tag => {
            if (!groups[tag.type]) groups[tag.type] = [];
            groups[tag.type].push(tag);
        });
    
        // Ordenar los tags dentro de cada tipo según la cantidad de productos asociados
        Object.keys(groups).forEach(type => {
            groups[type].sort((a, b) => (b.AssociatedToProd?.length || 0) - (a.AssociatedToProd?.length || 0));
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
            
            <FilterSection title="Equipo" defaultExpanded={true}>
                <FilterSection title="Clubes" defaultExpanded={false}>
                    {Object.entries(groupedTeams.clubes).map(([league, teams]) => (
                        <FilterSection key={league} title={league} defaultExpanded={false}>
                            <button onClick={() => handleSelectAll(teams)} className="mb-2 text-blue-500 underline">Seleccionar todos</button>
                            {teams.map(tag => (
                                <label key={tag.id} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={activeTags.includes(tag.id)}
                                        onChange={() => handleTagChange(tag.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{tag.name}</span>
                                </label>
                            ))}
                        </FilterSection>
                    ))}
                </FilterSection>
                <FilterSection title="Selecciones" defaultExpanded={false}>
                    {Object.entries(groupedTeams.selecciones).map(([competition, teams]) => (
                        <FilterSection key={competition} title={competition} defaultExpanded={false}>
                            <button onClick={() => handleSelectAll(teams)} className="mb-2 text-blue-500 underline">Seleccionar todos</button>
                            {teams.map(tag => (
                                <label key={tag.id} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={activeTags.includes(tag.id)}
                                        onChange={() => handleTagChange(tag.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{tag.name}</span>
                                </label>
                            ))}
                        </FilterSection>
                    ))}
                </FilterSection>
            </FilterSection>

            {groupedTags.map(([type, typeTags]) => type !== "equipo" && (
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
                                <span className="ml-2 text-sm text-gray-600">{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            ))}
        </div>
    );
};

export default TagFilter;