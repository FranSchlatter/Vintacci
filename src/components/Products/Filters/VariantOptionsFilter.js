import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterSection from './FilterSection';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const VariantOptionsFilter = () => {
  const dispatch = useDispatch();
  const { activeFilters } = useSelector(state => state.filters);
  const products = useSelector(state => state.products.allProducts);

  // Obtener todas las opciones disponibles dinámicamente
  const availableOptions = useMemo(() => {
    const optionsMap = new Map();

    products.forEach(product => {
      product.ProductVariants.forEach(variant => {
        if (variant.status === 'active' && variant.stock > 0) {
          variant.ProductOptions.forEach(option => {
            if (!optionsMap.has(option.type)) {
              optionsMap.set(option.type, new Map());
            }
            
            const typeMap = optionsMap.get(option.type);
            if (!typeMap.has(option.id)) {
              typeMap.set(option.id, {
                id: option.id,
                name: option.name,
                value: option.value,
                count: 1
              });
            } else {
              typeMap.get(option.id).count++;
            }
          });
        }
      });
    });

    return Array.from(optionsMap.entries()).map(([type, values]) => ({
      type,
      displayName: type.charAt(0).toUpperCase() + type.slice(1),
      options: Array.from(values.values()).sort((a, b) => a.name.localeCompare(b.name))
    }));
  }, [products]);

  const handleOptionChange = (optionType, optionId) => {
    const currentOptions = activeFilters.variantOptions || {};
    const typeOptions = currentOptions[optionType] || [];

    const newTypeOptions = typeOptions.includes(optionId)
      ? typeOptions.filter(id => id !== optionId)
      : [...typeOptions, optionId];

    dispatch(setActiveFilters({
      ...activeFilters,
      variantOptions: {
        ...currentOptions,
        [optionType]: newTypeOptions
      }
    }));
  };

  // Renderizar las opciones según su tipo
  const renderOptionValue = (type, option) => {
    if (type === 'color') {
      return (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: option.value }}
            title={option.name}
          />
          <span className="text-sm text-gray-600">
            {option.name} ({option.count})
          </span>
        </div>
      );
    }

    // Default para cualquier otro tipo de opción
    return (
      <span className="text-sm text-gray-600">
        {option.name} ({option.count})
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {availableOptions.map(({ type, displayName, options }) => (
        <FilterSection key={type} title={displayName}>
          <div className="space-y-2">
            {options.map(option => (
              <label
                key={option.id}
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.variantOptions?.[type]?.includes(option.id)}
                  onChange={() => handleOptionChange(type, option.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 flex-1">
                  {renderOptionValue(type, option)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      ))}
    </div>
  );
};

export default VariantOptionsFilter;