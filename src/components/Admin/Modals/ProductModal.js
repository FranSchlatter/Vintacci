import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import FormInput from '../../common/FormInput';
import FormSelect from '../../common/FormSelect';
import FormTextArea from '../../common/FormTextArea';
import VariantForm from '../../common/VariantForm';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createVariant } from '../../../redux/actions/productActions';

const ProductModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    product,
    categories,
    productOptions,
    tags 
}) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        categoryId: '',
        status: 'active',
        tags: []
    });

    const [selectedTags, setSelectedTags] = useState([]);
    const [variants, setVariants] = useState([]);
    const [showVariantForm, setShowVariantForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);
    const isEditing = !!product;

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                brand: product.brand || '',
                categoryId: product.categoryId || '',
                status: product.status || 'active',
                tags: product.Tags?.map(tag => tag.id) || []
            });
            setSelectedTags(product.Tags || []);
            setVariants(product.ProductVariants || []);
        } else {
            // Reset form for new product
            setFormData({
                name: '',
                description: '',
                brand: '',
                categoryId: '',
                status: 'active',
                tags: []
            });
            setSelectedTags([]);
            setVariants([]);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleVariantSave = async (variantData) => {
        if (isEditing) {
            // Si estamos editando un producto, crear la variante inmediatamente
            try {
                await dispatch(createVariant(product.id, variantData));
                setShowVariantForm(false);
                toast.success('Variante agregada correctamente');
            } catch (error) {
                toast.error('Error al agregar la variante');
            }
        } else {
            // Si estamos creando un producto nuevo, agregar a la lista temporal
            setVariants(prev => [...prev, variantData]);
            setShowVariantForm(false);
        }
    };

    const handleVariantDelete = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.description) newErrors.description = 'La descripción es requerida';
        if (!formData.brand) newErrors.brand = 'La marca es requerida';
        if (!formData.categoryId) newErrors.categoryId = 'La categoría es requerida';
        if (variants.length === 0 && !isEditing) {
            newErrors.variants = 'Debe agregar al menos una variante';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar el formulario antes de enviarlo
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        try {
            const dataToSend = {
                ...formData,
                tags: selectedTags.map(tag => tag.id),
            };
    
            // Si estamos editando, incluimos las variantes existentes
            if (product) {
                dataToSend.variants = product.ProductVariants;
            } else {
                // Si estamos creando, validamos que haya al menos una variante
                if (!variants.length) {
                    setErrors({ ...errors, variants: 'Debe agregar al menos una variante' });
                    return;
                }
                dataToSend.variants = variants;
            }
    
            await onSave(dataToSend);
            onClose();
        } catch (error) {
            console.error('Error en submit:', error);
            setErrors(error.errors || {});
        }
    };

    const VariantPreview = ({ variant, index }) => (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-4">
                <img 
                    src={variant.image_url} 
                    alt="Variant preview" 
                    className="h-12 w-12 object-cover rounded"
                />
                <div>
                    {variant.sku && (
                        <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                        {variant.options?.map((optionId, i) => {
                            const option = productOptions.find(opt => opt.id === optionId);
                            return option ? (
                                <span
                                    key={i}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                    {`${option.type}: ${option.name}`}
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">
                        Precio: ${variant.price}
                        {variant.discountPrice && (
                            <span className="ml-2 text-red-600">
                                Descuento: ${variant.discountPrice}
                            </span>
                        )}
                    </p>
                    <p className="text-sm">Stock: {variant.stock}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={() => {
                        setEditingVariantIndex(index);
                        setShowVariantForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Edit className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => handleVariantDelete(index)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <button 
                            onClick={onClose}
                            className="hover:bg-gray-100 p-2 rounded-full"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campos básicos del producto */}
                        <FormInput
                            label="Nombre del Producto"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />

                        <FormTextArea
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={errors.description}
                            required
                        />

                        <FormInput
                            label="Marca"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            error={errors.brand}
                            required
                        />

                        <FormSelect
                            label="Categoría"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            options={categories.map(cat => ({
                                value: cat.id,
                                label: cat.name
                            }))}
                            error={errors.categoryId}
                            required
                        />

                        <FormSelect
                            label="Estado"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={[
                                { value: 'active', label: 'Activo' },
                                { value: 'inactive', label: 'Inactivo' },
                                { value: 'draft', label: 'Borrador' }
                            ]}
                            error={errors.status}
                        />

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedTags.map(tag => (
                                    <span 
                                        key={tag.id} 
                                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {tag.name}
                                        <button 
                                            onClick={() => setSelectedTags(prev => 
                                                prev.filter(t => t.id !== tag.id)
                                            )}
                                            className="ml-1 hover:text-blue-600"
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    const tag = tags.find(t => t.id === e.target.value);
                                    if (tag && !selectedTags.some(t => t.id === tag.id)) {
                                        setSelectedTags(prev => [...prev, tag]);
                                    }
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Agregar tag...</option>
                                {tags
                                    .filter(tag => !selectedTags.some(t => t.id === tag.id))
                                    .map(tag => (
                                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                                    ))}
                            </select>
                        </div>

                        {/* Sección de variantes para ambos modos */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Variantes</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingVariantIndex(null);
                                        setShowVariantForm(true);
                                    }}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Variante
                                </button>
                            </div>

                            {errors.variants && (
                                <p className="text-sm text-red-600">{errors.variants}</p>
                            )}

                            <div className="space-y-2">
                                {variants?.map((variant, index) => (
                                    <VariantPreview
                                        key={index}
                                        variant={variant}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modal de Variante */}
                        {showVariantForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                                    <VariantForm
                                        variant={editingVariantIndex !== null ? variants[editingVariantIndex] : null}
                                        availableOptions={productOptions}
                                        onSave={handleVariantSave}
                                        onCancel={() => {
                                            setShowVariantForm(false);
                                            setEditingVariantIndex(null);
                                        }}
                                        isEditing={editingVariantIndex !== null}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal de Variante */}
                {showVariantForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                            <VariantForm
                                availableOptions={productOptions}
                                onSave={handleVariantSave}
                                onCancel={() => setShowVariantForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductModal;