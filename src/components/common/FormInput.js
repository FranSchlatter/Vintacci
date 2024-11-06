// src/components/common/FormInput.js
const FormInput = ({ label, name, type = "text", error, value, onChange, required = false, placeholder = "", icon = null, className = "" }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      )}
      <div className="relative">
        {icon}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
  
  export default FormInput;