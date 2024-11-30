import React, { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateVariant, deleteVariant } from '../../redux/actions/productActions';
import { toast } from 'react-toastify';

const VariantRow = ({ variant, productId }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        price: variant.price,
        stock: variant.stock,
        status: variant.status,
        image_url: variant.image_url,
        discountPrice: variant.discountPrice || '',
        discountStart: variant.discountStart || '',
        discountEnd: variant.discountEnd || ''
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const dataToSend = {
                ...editData,
                price: Number(editData.price),
                stock: Number(editData.stock),
                discountPrice: editData.discountPrice ? Number(editData.discountPrice) : null,
                discountStart: editData.discountStart || null,
                discountEnd: editData.discountEnd || null,
                sku: variant.sku,
                options: variant.ProductOptions
            };

            await dispatch(updateVariant(productId, variant.id, dataToSend));
            setIsEditing(false);
            toast.success('Variante actualizada correctamente');
        } catch (error) {
            toast.error('Error al actualizar la variante');
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteVariant(productId, variant.id));
            toast.success('Variante eliminada correctamente');
        } catch (error) {
            toast.error('Error al eliminar la variante');
        }
    };

    if (isEditing) {
        return (
            <tr>
                <td className="px-6 py-4">
                    <input
                        type="text"
                        name="image_url"
                        value={editData.image_url}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="URL de la imagen"
                    />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                    {variant.sku}
                </td>
                <td className="px-6 py-4">
                    {variant.ProductOptions?.map((option) => (
                        <span
                            key={option.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1"
                        >
                            {`${option.type}: ${option.name}`}
                        </span>
                    ))}
                </td>
                <td className="px-6 py-4 space-y-2">
                    <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleChange}
                        className="w-24 p-2 border rounded-md text-sm"
                        placeholder="Precio"
                    />
                    <div className="space-y-1">
                        <input
                            type="number"
                            name="discountPrice"
                            value={editData.discountPrice}
                            onChange={handleChange}
                            className="w-24 p-2 border rounded-md text-sm"
                            placeholder="Precio descuento"
                        />
                        <input
                            type="datetime-local"
                            name="discountStart"
                            value={editData.discountStart}
                            onChange={handleChange}
                            className="w-40 p-2 border rounded-md text-sm"
                        />
                        <input
                            type="datetime-local"
                            name="discountEnd"
                            value={editData.discountEnd}
                            onChange={handleChange}
                            className="w-40 p-2 border rounded-md text-sm"
                        />
                    </div>
                </td>
                <td className="px-6 py-4">
                    <input
                        type="number"
                        name="stock"
                        value={editData.stock}
                        onChange={handleChange}
                        className="w-24 p-2 border rounded-md text-sm"
                    />
                </td>
                <td className="px-6 py-4">
                    <select
                        name="status"
                        value={editData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md text-sm"
                    >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td className="px-6 py-4">
                {variant.image_url ? (
                    <img 
                        src={variant.image_url} 
                        alt={variant.sku} 
                        className="h-12 w-12 object-cover rounded"
                    />
                ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">
                {variant.sku}
            </td>
            <td className="px-6 py-4">
                {variant.ProductOptions?.map((option) => (
                    <span
                        key={option.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1"
                    >
                        {`${option.type}: ${option.name}`}
                    </span>
                ))}
            </td>
            <td className="px-6 py-4">
                <div>
                    {variant.discountPrice ? (
                        <>
                            <span className="line-through text-gray-500">
                                {formatPrice(variant.price)}
                            </span>
                            <span className="ml-2 text-red-600">
                                {formatPrice(variant.discountPrice)}
                            </span>
                        </>
                    ) : (
                        formatPrice(variant.price)
                    )}
                </div>
                {variant.discountStart && variant.discountEnd && (
                    <div className="text-xs text-gray-500">
                        {new Date(variant.discountStart).toLocaleDateString()} - 
                        {new Date(variant.discountEnd).toLocaleDateString()}
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                {variant.stock}
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    variant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {variant.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-900"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-900"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default VariantRow;