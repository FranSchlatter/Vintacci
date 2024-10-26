// src/components/Filters/FilterSection.js
import React, { useState } from 'react';
import { filterConfig } from '../../config/filterConfig';

const FilterSection = ({ title, field, values, activeValues, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border-b pb-4">
            <button
                className="flex justify-between items-center w-full py-2"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="font-medium">{title}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="mt-2 space-y-2">
                    {filterConfig[field].options.map((option) => {
                        const count = values[option] || 0;
                        const isDisabled = count === 0;
                        
                        return (
                            <label
                                key={option}
                                className={`flex items-center space-x-2 ${
                                    isDisabled 
                                        ? 'cursor-not-allowed text-gray-400' 
                                        : 'cursor-pointer text-gray-700'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={activeValues.includes(option)}
                                    onChange={(e) => onChange(field, option, e.target.checked)}
                                    disabled={isDisabled}
                                    className={`rounded border-gray-300 
                                        ${isDisabled 
                                            ? 'bg-gray-100 cursor-not-allowed' 
                                            : 'text-blue-600 cursor-pointer'
                                        }
                                        focus:ring-blue-500`}
                                />
                                <span className="text-sm">{option}</span>
                                <span className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                    ({count})
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterSection;