import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const ORDERED_TYPES = ["edicion", "version", "equipo", "temporada", "caracteristica", "color"];
const TYPE_NAMES = {
  "edicion": "Edición",
  "version": "Versión",
  "equipo": "Equipo",
  "temporada": "Temporada",
  "caracteristica": "Característica",
  "color": "Color"
};

const TagFilter = ({ tags, activeTags }) => {
    const dispatch = useDispatch();
    const activeFilters = useSelector(state => state.filters.activeFilters);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para controlar expansión
    const [expandedSections, setExpandedSections] = useState({});

    const handleTagChange = (tagId) => {
        const newTags = activeTags.includes(tagId)
            ? activeTags.filter(id => id !== tagId)
            : [...activeTags, tagId];

        dispatch(setActiveFilters({
            ...activeFilters,
            tags: newTags
        }));
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
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
        const CLUB_ORDER = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Primera División", 'Eredivise', 'Primeira Liga', "MLS", "Chile Primera División", "Liga MX", "Otros"];
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

    // Render TagList - Para simplificar el código
    const renderTagList = (tagList, selectAllOption = false) => (
        <div className="space-y-1 mt-2">
            {selectAllOption && tagList.length > 0 && (
                <button 
                    onClick={() => handleSelectAll(tagList)} 
                    className="text-blue-500 text-sm hover:underline mb-2 flex items-center"
                >
                    <span className="ml-1">Seleccionar todos</span>
                </button>
            )}
            <div className="grid grid-cols-2 gap-1">
                {tagList.map(tag => (
                    <label key={tag.id} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                        <input
                            type="checkbox"
                            checked={activeTags.includes(tag.id)}
                            onChange={() => handleTagChange(tag.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600 truncate">{tag.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // Render League Section - Para los equipos
    const renderLeagueSection = (title, teams) => {
        const sectionId = `league-${title}`;
        return (
            <div key={title} className="border-t border-gray-200 pt-2 pb-1">
                <button 
                    onClick={() => toggleSection(sectionId)}
                    className="flex justify-between items-center w-full text-left py-1"
                >
                    <span className="text-sm font-medium text-gray-700">{title}</span>
                    {expandedSections[sectionId] ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </button>
                {expandedSections[sectionId] && renderTagList(teams, true)}
            </div>
        );
    };

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
            
            {/* Sección de Equipos - Rediseñada */}
            <FilterSection title="Equipos" defaultExpanded={false}>
                <div className="space-y-2">
                    {/* Subsección Clubes */}
                    <div 
                        className="bg-gray-50 rounded-md p-2 cursor-pointer"
                        onClick={() => toggleSection('clubes')}
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-800">Clubes</h4>
                            {expandedSections['clubes'] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                        </div>
                    </div>
                    
                    {expandedSections['clubes'] && (
                        <div className="pl-2 space-y-1">
                            {Object.entries(groupedTeams.clubes).map(([league, teams]) => 
                                renderLeagueSection(league, teams)
                            )}
                        </div>
                    )}
                    
                    {/* Subsección Selecciones */}
                    <div 
                        className="bg-gray-50 rounded-md p-2 cursor-pointer mt-3"
                        onClick={() => toggleSection('selecciones')}
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-800">Selecciones</h4>
                            {expandedSections['selecciones'] ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                        </div>
                    </div>
                    
                    {expandedSections['selecciones'] && (
                        <div className="pl-2 space-y-1">
                            {Object.entries(groupedTeams.selecciones).map(([competition, teams]) => 
                                renderLeagueSection(competition, teams)
                            )}
                        </div>
                    )}
                </div>
            </FilterSection>

            {/* Otras categorías de tags */}
            {groupedTags.map(([type, typeTags]) => type !== "equipo" && (
                <FilterSection key={type} title={TYPE_NAMES[type] || type.charAt(0).toUpperCase() + type.slice(1)} defaultExpanded={false}>
                    {renderTagList(typeTags)}
                </FilterSection>
            ))}
        </div>
    );
};

export default TagFilter;