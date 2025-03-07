import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Componente base para cada sección de filtro que maneja la expansión/colapso
const FilterSection = ({ title, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-200 pb-4 pt-2">
      {/* Cabecera de la sección */}
      <button
        className="flex justify-between items-center w-full py-2 text-left bg-gray-50 px-3 rounded-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-3 space-y-2 px-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;