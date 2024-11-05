// src/components/UserProfile/UserAddresses.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchUserAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} from '../../redux/actions/addressActions';
import { 
    MapPin, 
    Plus, 
    Edit, 
    Trash2, 
    Star, 
    Check 
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserAddresses = ({ userId }) => {
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.addresses.addresses);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        alias: '',
        first_name: '',
        last_name: '',
        street: '',
        number: '',
        apartment: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        is_default: false
    });

    useEffect(() => {
        dispatch(fetchUserAddresses(userId));
    }, [dispatch, userId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await dispatch(updateAddress(editingAddress.id, formData));
            } else {
                await dispatch(addAddress(userId, formData));
            }
            resetForm();
            toast.success(editingAddress ? 'Dirección actualizada' : 'Dirección agregada');
        } catch (error) {
            toast.error('Error al guardar la dirección');
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('¿Estás seguro de eliminar esta dirección?')) {
            try {
                await dispatch(deleteAddress(addressId));
                toast.success('Dirección eliminada');
            } catch (error) {
                toast.error('Error al eliminar la dirección');
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await dispatch(setDefaultAddress(addressId, userId));
            toast.success('Dirección predeterminada actualizada');
        } catch (error) {
            toast.error('Error al actualizar la dirección predeterminada');
        }
    };

    const resetForm = () => {
        setFormData({
            alias: '',
            first_name: '',
            last_name: '',
            street: '',
            number: '',
            apartment: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            phone: '',
            is_default: false
        });
        setEditingAddress(null);
        setIsAddingNew(false);
    };

    const handleEdit = (address) => {
        setFormData(address);
        setEditingAddress(address);
        setIsAddingNew(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mis Direcciones</h2>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        <span>Agregar Dirección</span>
                    </button>
                )}
            </div>

            {/* Formulario */}
            {isAddingNew && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Apellido
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Calle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Calle
                            </label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Número */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Número
                            </label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Departamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Departamento
                            </label>
                            <input
                                type="text"
                                name="apartment"
                                value={formData.apartment}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                         {/* Alias */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Alias (ej: Casa, Trabajo)
                            </label>
                            <input
                                type="text"
                                name="alias"
                                value={formData.alias}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Estado/Provincia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Estado/Provincia
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* País */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                País
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Código Postal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Dirección predeterminada */}
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Establecer como dirección predeterminada
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {editingAddress ? 'Actualizar' : 'Guardar'} Dirección
                        </button>
                    </div>
                </form>
            )}

            {/* Lista de direcciones (se mantiene igual) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(address => (
                    <div
                        key={address.id}
                        className="border rounded-lg p-4 relative hover:shadow-md transition-shadow"
                    >
                        {address.is_default && (
                            <span className="absolute top-2 right-2 text-yellow-500">
                                <Star size={20} fill="currentColor" />
                            </span>
                        )}
                        
                        <div className="flex items-start space-x-3">
                            <MapPin className="text-gray-400 mt-1" size={20} />
                            <div className="flex-1">
                                <h3 className="font-medium">{address.alias}</h3>
                                <p className="text-sm text-gray-600">
                                    {address.street} {address.number}
                                    {address.apartment && `, ${address.apartment}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.city}, {address.state}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {address.country} ({address.postal_code})
                                </p>
                                <p className="text-sm text-gray-600">
                                    Tel: {address.phone}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            {!address.is_default && (
                                <button
                                    onClick={() => handleSetDefault(address.id)}
                                    className="p-2 text-gray-500 hover:text-yellow-500"
                                    title="Establecer como predeterminada"
                                >
                                    <Star size={18} />
                                </button>
                            )}
                            <button
                                onClick={() => handleEdit(address)}
                                className="p-2 text-gray-500 hover:text-blue-500"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="p-2 text-gray-500 hover:text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserAddresses;