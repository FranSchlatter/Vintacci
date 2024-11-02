// src/components/UserProfile/PersonalInfo.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/actions/userActions';
import { toast } from 'react-toastify';
import { Edit, Save } from 'lucide-react';

const PersonalInfo = ({ user }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        dni: user.dni || '',
        phone: user.phone || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser(user.id, formData));
            setIsEditing(false);
            toast.success('Perfil actualizado con éxito');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al actualizar el perfil');
        }
    };

    if (!isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Información Personal</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                        <Edit size={20} />
                        <span>Editar</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-500">Nombre</label>
                        <p className="font-medium">{user.first_name}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm text-gray-500">Apellido</label>
                        <p className="font-medium">{user.last_name}</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Username</label>
                        <p className="font-medium">{user.username}</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{user.email}</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">DNI</label>
                        <p className="font-medium">{user.dni}</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Teléfono</label>
                        <p className="font-medium">{user.phone || '-'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Editar Información Personal</h2>
                <div className="space-x-2">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Save size={20} />
                        <span>Guardar</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        DNI
                    </label>
                    <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

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
                    />
                </div>
            </div>
        </form>
    );
};

export default PersonalInfo;