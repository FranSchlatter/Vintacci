import React from 'react';
import VariantRow from './VariantRow';

const VariantsList = ({ variants, productId }) => {
    if (!variants?.length) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">No hay variantes disponibles</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opciones</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant) => (
                        <VariantRow
                            key={variant.id}
                            variant={variant}
                            productId={productId}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VariantsList;