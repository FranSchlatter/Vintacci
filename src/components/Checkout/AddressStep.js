import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddresses, addAddress } from '../../redux/actions/addressActions';
import { MapPin, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { addressSchema, formatZodErrors } from '../../config/validationSchemas';
import FormInput from '../common/FormInput';

const AddressStep = ({ onComplete }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.currentUser);
    const addresses = useSelector(state => state.addresses.addresses);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        alias: '', first_name: '', last_name: '', street: '', number: '', apartment: '',
        city: '', state: '', postal_code: '', country: '', phone: '', is_default: false
    });

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchUserAddresses(currentUser.id));
        }
    }, [dispatch, currentUser]);

    const resetForm = useCallback(() => {
        setFormData({
            alias: '',
            first_name: currentUser?.first_name || '',
            last_name: currentUser?.last_name || '',
            street: '',
            number: '',
            apartment: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'México',
            phone: currentUser?.phone || '',
            is_default: false
        });
        setErrors({});
    }, [currentUser]);
    
    useEffect(() => {
        if (currentUser) {
            resetForm();
        }
    }, [currentUser, resetForm]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddress = addresses.find(addr => addr.is_default);
            setSelectedAddressId(defaultAddress ? defaultAddress.id : addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser?.id) {
            toast.error('Debes iniciar sesión para agregar una dirección');
            return;
        }

        try {
            const validatedData = addressSchema.parse(formData);
            const result = await dispatch(addAddress(currentUser.id, validatedData));
            if (result.error) throw new Error(result.error);
            
            dispatch(fetchUserAddresses(currentUser.id));
            resetForm();
            setIsAddingNew(false);
            toast.success('Dirección agregada correctamente');
        } catch (error) {
            if (error.errors) {
                setErrors(formatZodErrors(error));
            } else {
                toast.error('Error al guardar la dirección');
            }
        }
    };

    const handleContinue = () => {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            onComplete(selectedAddress);
        } else {
            toast.error('Por favor seleccione una dirección de envío');
        }
    };

    if (!currentUser?.id) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                Por favor inicie sesión para continuar con la compra
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Dirección de Envío</h2>
            
            {addresses.length > 0 && !isAddingNew && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {addresses.map(address => (
                            <div
                                key={address.id}
                                onClick={() => setSelectedAddressId(address.id)}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedAddressId === address.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'hover:border-gray-400'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    {selectedAddressId === address.id ? (
                                        <Check className="text-blue-500 mt-1" size={20} />
                                    ) : (
                                        <MapPin className="text-gray-400 mt-1" size={20} />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{address.alias}</h3>
                                        <p className="text-sm text-gray-600">{address.first_name} {address.last_name}</p>
                                        <p className="text-sm text-gray-600">
                                            {address.street} {address.number}
                                            {address.apartment && `, ${address.apartment}`}
                                        </p>
                                        <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                                        <p className="text-sm text-gray-600">{address.country} ({address.postal_code})</p>
                                        <p className="text-sm text-gray-600">Tel: {address.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => { setIsAddingNew(true); resetForm(); }}
                            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                            <Plus size={20} />
                            <span>Agregar Nueva Dirección</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleContinue}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {(isAddingNew || addresses.length === 0) && (
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Alias (ej: Casa, Trabajo)" name="alias" value={formData.alias} onChange={handleInputChange} error={errors.alias} required />
                        <FormInput label="Nombre" name="first_name" value={formData.first_name} onChange={handleInputChange} error={errors.first_name} required />
                        <FormInput label="Apellido" name="last_name" value={formData.last_name} onChange={handleInputChange} error={errors.last_name} required />
                        <FormInput label="Teléfono" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} required />

                        <div className="md:col-span-2">
                            <FormInput label="Calle" name="street" value={formData.street} onChange={handleInputChange} error={errors.street} required />
                        </div>

                        <FormInput label="Número" name="number" value={formData.number} onChange={handleInputChange} error={errors.number} required />
                        <FormInput label="Departamento (opcional)" name="apartment" value={formData.apartment} onChange={handleInputChange} error={errors.apartment} />
                        <FormInput label="Ciudad" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} required />
                        <FormInput label="Estado" name="state" value={formData.state} onChange={handleInputChange} error={errors.state} required />
                        <FormInput label="Código Postal" name="postal_code" value={formData.postal_code} onChange={handleInputChange} error={errors.postal_code} required />
                        <FormInput label="País" name="country" value={formData.country} onChange={handleInputChange} error={errors.country} required />

                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Establecer como dirección predeterminada</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        {addresses.length > 0 && (
                            <button
                                type="button"
                                onClick={() => { setIsAddingNew(false); resetForm(); }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        )}
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Guardar nueva dirección
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddressStep;