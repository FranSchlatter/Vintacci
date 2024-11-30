import React from 'react';

const FormInput = ({ 
    label, 
    error, 
    className = "", 
    required = false, 
    ...props 
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                {...props}
                className={`
                    w-full px-3 py-2 border rounded-lg shadow-sm
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500
                    ${error ? 'border-red-300' : 'border-gray-300'}
                    ${className}
                `}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormInput;