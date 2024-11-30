// CreateVariantModal.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createVariant } from '../../../redux/actions/productActions';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import VariantOptionSelect from '../../common/VariantOptionSelect';

const CreateVariantModal = ({ productId, onClose, availableOptions }) => {
   const dispatch = useDispatch();
   const [formData, setFormData] = useState({
       price: '',
       stock: '',
       image_url: '',
       status: 'active',
       options: []
   });

   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createVariant(productId, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            }));
            toast.success('Variante creada exitosamente');
            onClose();
        } catch (error) {
            toast.error('Error al crear la variante');
        }
    };

   return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
               <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-semibold">Nueva Variante</h2>
                   <button onClick={onClose}>
                       <X size={24} />
                   </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                       <input
                           type="number"
                           placeholder="Precio"
                           value={formData.price}
                           onChange={e => setFormData(prev => ({...prev, price: e.target.value}))}
                           className="border p-2 rounded"
                           required
                       />
                       <input
                           type="number"
                           placeholder="Stock"
                           value={formData.stock}
                           onChange={e => setFormData(prev => ({...prev, stock: e.target.value}))}
                           className="border p-2 rounded"
                           required
                       />
                   </div>

                   <input
                       type="url"
                       placeholder="URL de imagen"
                       value={formData.image_url}
                       onChange={e => setFormData(prev => ({...prev, image_url: e.target.value}))}
                       className="w-full border p-2 rounded"
                       required
                   />

                    <VariantOptionSelect
                        options={availableOptions}
                        selectedOptions={formData.options}
                        onChange={options => setFormData(prev => ({...prev, options}))}
                    />  

                   <div className="flex justify-end space-x-2">
                       <button
                           type="button"
                           onClick={onClose}
                           className="px-4 py-2 border rounded hover:bg-gray-50"
                       >
                           Cancelar
                       </button>
                       <button
                           type="submit"
                           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                       >
                           Crear Variante
                       </button>
                   </div>
               </form>
           </div>
       </div>
   );
};

export default CreateVariantModal;