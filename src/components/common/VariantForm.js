import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import VariantOptionSelect from './VariantOptionSelect';
import { X } from 'lucide-react';

const VariantForm = ({ 
    variant,
    availableOptions,
    onSave,
    onCancel,
    isEditing = false 
}) => {
    const [formData, setFormData] = useState({
        price: '',
        stock: '',
        image_url: '',
        status: 'active',
        discountPrice: '',
        discountStart: '',
        discountEnd: '',
        options: []
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (variant) {
            setFormData({
                price: variant.price?.toString() || '',
                stock: variant.stock?.toString() || '',
                image_url: variant.image_url || '',
                status: variant.status || 'active',
                discountPrice: variant.discountPrice?.toString() || '',
                discountStart: variant.discountStart || '',
                discountEnd: variant.discountEnd || '',
                options: variant.options || []
            });
        }
    }, [variant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleOptionChange = (type, option) => {
        if (option) {
            setFormData(prev => {
                const newOptions = [...prev.options.filter(opt => opt.type !== type)];
                newOptions.push(option.id);
                return { ...prev, options: newOptions };
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }
        if (!formData.stock || Number(formData.stock) < 0) {
            newErrors.stock = 'El stock debe ser un número válido';
        }
        if (!formData.image_url) {
            newErrors.image_url = 'La imagen es requerida';
        }
        if (formData.options.length === 0) {
            newErrors.options = 'Debe seleccionar al menos una opción';
        }
        if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.price)) {
            newErrors.discountPrice = 'El precio de descuento debe ser menor al precio regular';
        }
        if (formData.discountPrice && (!formData.discountStart || !formData.discountEnd)) {
            newErrors.discountTime = 'Debe especificar fechas de inicio y fin del descuento';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const submissionData = {
            price: Number(formData.price),
            stock: Number(formData.stock),
            image_url: formData.image_url,
            status: formData.status,
            discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
            discountStart: formData.discountStart || null,
            discountEnd: formData.discountEnd || null,
            options: formData.options
        };

        onSave(submissionData);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                    {isEditing ? 'Editar Variante' : 'Nueva Variante'}
                </h3>
                <button 
                    type="button"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                    label="Imagen URL"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    error={errors.image_url}
                    required
                    placeholder="https://ejemplo.com/imagen.jpg"
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Precio"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        error={errors.price}
                        required
                    />

                    <FormInput
                        label="Stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        error={errors.stock}
                        required
                    />
                </div>

                <FormSelect
                    label="Estado"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'active', label: 'Activo' },
                        { value: 'inactive', label: 'Inactivo' }
                    ]}
                />

                <div className="space-y-4">
                    <h4 className="font-medium">Precios con descuento</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Precio con descuento"
                            name="discountPrice"
                            type="number"
                            step="0.01"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            error={errors.discountPrice}
                        />
                    </div>
                    {errors.discountTime && (
                        <p className="text-sm text-red-600">{errors.discountTime}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Inicio del descuento"
                            name="discountStart"
                            type="datetime-local"
                            value={formData.discountStart}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Fin del descuento"
                            name="discountEnd"
                            type="datetime-local"
                            value={formData.discountEnd}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium">Opciones de la variante</h4>
                    <VariantOptionSelect
                        options={availableOptions || []}
                        selectedOptions={formData.options.map(optionId => 
                            availableOptions?.find(opt => opt.id === optionId)
                        ).filter(Boolean)}
                        onChange={handleOptionChange}
                        error={errors.options}
                    />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                    >
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VariantForm;