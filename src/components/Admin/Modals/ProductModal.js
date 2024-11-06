import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { filterConfig } from '../../../config/filterConfig';
import { productSchema, formatZodErrors } from '../../../config/validationSchemas';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import FormTextArea from '../../common/FormTextArea';

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', brand: '', style: '', era: '',
    size: '', sex: '', color: '', material: '', image_url: '', stock: '', serial_number: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '', description: '', price: '', category: '', brand: '', style: '', era: '',
        size: '', sex: '', color: '', material: '', image_url: '', stock: '', serial_number: ''
      });
    }
    setErrors({});
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validatedData = productSchema.parse(formData);
      onSave(validatedData);
    } catch (error) {
      setErrors(formatZodErrors(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full"><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Información básica */}
              <div className="space-y-4">
                <FormInput label="Nombre del Producto" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                <FormTextArea label="Descripción" name="description" value={formData.description} onChange={handleChange} error={errors.description} required />
                <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} error={errors.brand} required />
                <FormInput label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} error={errors.price} required />
                <FormInput label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} error={errors.stock} required />
              </div>

              {/* Características */}
              <div className="space-y-4">
                <FormSelect label="Categoría" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={filterConfig.category.options} required />
                <FormSelect label="Género" name="sex" value={formData.sex} onChange={handleChange} error={errors.sex} options={filterConfig.sex.options} required />
                <FormSelect label="Talla" name="size" value={formData.size} onChange={handleChange} error={errors.size} options={filterConfig.size.options} required />
                <FormSelect label="Estilo" name="style" value={formData.style} onChange={handleChange} error={errors.style} options={filterConfig.style.options} required />
                <FormSelect label="Época" name="era" value={formData.era} onChange={handleChange} error={errors.era} options={filterConfig.era.options} required />
              </div>
            </div>

            {/* Imagen y detalles adicionales */}
            <div className="space-y-4">
              <FormInput label="URL de la Imagen" name="image_url" value={formData.image_url} onChange={handleChange} error={errors.image_url} required />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Color" name="color" value={formData.color} onChange={handleChange} error={errors.color} required />
                <FormInput label="Material" name="material" value={formData.material} onChange={handleChange} error={errors.material} required />
                <FormInput label="Número de Serie" name="serial_number" value={formData.serial_number} onChange={handleChange} error={errors.serial_number} required />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {product ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;