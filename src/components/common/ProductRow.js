import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import VariantsList from './VariantsList';

const ProductRow = ({ product, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center h-16 w-16 overflow-hidden rounded-lg">
                        {product.ProductVariants?.[0]?.image_url ? (
                            <img 
                                src={product.ProductVariants[0].image_url} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Sin imagen</span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.Category?.name || 'Sin categoría'}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.brand}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {product.Tags?.map((tag) => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-900">
                        {product.ProductVariants?.length || 0}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={() => onEdit(product)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(product)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            {isExpanded ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                            }
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan="8">
                        <div className="border-l-4 border-blue-500 bg-gray-50 p-4 m-2 rounded-r-lg shadow-inner">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                                Variantes del producto
                            </div>
                            <VariantsList 
                                variants={product.ProductVariants || []}
                                productId={product.id}
                            />
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default ProductRow;