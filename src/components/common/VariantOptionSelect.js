import React from 'react';
import FormSelect from './FormSelect';

const VariantOptionSelect = ({ 
    options = [], 
    selectedOptions = [], 
    onChange,
    error 
}) => {
    // Agrupar opciones por tipo
    const optionsByType = options.reduce((acc, opt) => {
        if (!acc[opt.type]) {
            acc[opt.type] = [];
        }
        acc[opt.type].push(opt);
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            {Object.entries(optionsByType).map(([type, typeOptions]) => {
                const selectedOption = selectedOptions.find(opt => opt.type === type);
                
                return (
                    <FormSelect
                        key={type}
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        name={`option-${type}`}
                        value={selectedOption?.id || ''}
                        onChange={(e) => {
                            const selectedOption = typeOptions.find(opt => opt.id === e.target.value);
                            onChange(type, selectedOption);
                        }}
                        options={typeOptions.map(opt => ({
                            value: opt.id,
                            label: opt.name
                        }))}
                        error={error}
                        required
                    />
                );
            })}
        </div>
    );
};

export default VariantOptionSelect;