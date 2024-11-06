// src/components/common/FormSelect.js
const FormSelect = ({ label, name, value, onChange, error, required = false, options = [] }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map(option => 
          typeof option === 'object' 
            ? <option key={option.value} value={option.value}>{option.label}</option>
            : <option key={option} value={option}>{option}</option>
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
  
export default FormSelect;