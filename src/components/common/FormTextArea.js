// src/components/common/FormTextArea.js
const FormTextArea = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    required = false,
    rows = 3
  }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };
  
  export default FormTextArea;